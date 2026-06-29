import { supabase } from "../config/supabase"

type TextChunk = {
    document_id: string,
    chunk: string,
    chunk_order: number,
    doc_order_number: number,
    chunk_condition: string
}

export const textChunking = async (documentId: string, text: string, chunkGroup: number): Promise<{chunkCount: number}> => {


    let chunkCount = 0

    const documentChunks: TextChunk[] = []

    const textArray = text.split(" ")

    for (let i = 0; i < textArray.length; i += chunkGroup){
        ++chunkCount
     const chunkSection = textArray.slice(i, i + chunkGroup)

if (chunkSection.length === 0) {
    break;
}


     const chunk = chunkSection.join(" ")

     const chunkedText = {
        document_id: documentId,
        chunk,
        chunk_order: chunkCount,
        doc_order_number: i + chunkGroup,
        chunk_condition: "Word"
     }

     documentChunks.push(chunkedText)

 
continue;
    }

    const {error: saveChunkError} = await supabase
    .from("chunks")
    .insert(documentChunks)

    if (saveChunkError) {
        await supabase.from("documents").update({status: "failed"}).eq("document_id", documentId)

        throw new Error("Could not save Chunks")}

    return {chunkCount}

}

