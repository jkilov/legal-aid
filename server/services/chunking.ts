import { supabase } from "../config/supabase"
import {sendDocumentStatus} from "../src/webSocket"

import { chunkEmbedding } from "./chunkEmbedding"

type TextChunk = {
    document_id: string,
    chunk: string,
    chunk_order: number,
    doc_order_number: number,
    chunk_condition: string
}

export const textChunking = async (userId: string, documentId: string, text: string, chunkGroup: number): Promise<{chunkCount: number}> => {


    let chunkCount = 0

    const documentChunks: TextChunk[] = []

    const textArray = text.split(" ")

    sendDocumentStatus(userId, documentId, "chunking")

    for (let i = 0; i < textArray.length; i += chunkGroup){
        ++chunkCount
     const chunkSection = textArray.slice(i, i + chunkGroup)

if (chunkSection.length === 0) {
    break;
}


     const chunk = chunkSection.join(" ")

     const embedding = await chunkEmbedding(chunk)

     const chunkedText = {
        document_id: documentId,
        chunk,
        chunk_order: chunkCount,
        embedding,
        doc_order_number: i + chunkGroup,
        chunk_condition: "Word"
     }

     
     documentChunks.push(chunkedText)

 
continue;
    }

    const { data: chunkedData, error: saveChunkError} = await supabase
    .from("chunks")
    .insert(documentChunks)
    .select()

    if (saveChunkError || !chunkedData) {

        sendDocumentStatus(userId, documentId, "failed")
        await supabase.from("documents").update({status: "failed"}).eq("document_id", documentId)

        throw new Error("Could not save Chunks")
    }
    sendDocumentStatus(userId, documentId, "embedding")

    const {data: updatedStatus, error:statusUpdateError} = await supabase.from("documents").update({status: "ready"}).eq("document_id", documentId ).select().single()

    if (statusUpdateError || !updatedStatus) throw new Error("Error updating status to Ready")

        sendDocumentStatus(userId, documentId, "ready")


    return {chunkCount}

}

//braindump notes
// I decided to incorporate the embedding process here rather than as a standalone service that would sit in the controller alongside the other services.
// I did this because the other option means we are making additional DB calls to then add the embeddings to the chunks table which becomes expensive as this scales across larger DocumentState, as well as slowing down the process.
// The function that would be used (most likely a forEach or for) is also expensive s it would need to loop through each chuk one by one to place the embeddings in the table, rather than placing the embedding at the time the chunk is created.
// Lastly, the chunks on their own are useless so creating a stable feature means we need the embeddings alongside the chunk