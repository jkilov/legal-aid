import {supabase} from "../config/supabase"
import {extractText, getDocumentProxy} from "unpdf"
import { textChunking } from "./chunking"
import {sendDocumentStatus} from "../src/webSocket"


export const chunkDocumentService = async(documentId: string, filePath: string) => {

    let userId: string | undefined

    try {

        //update document status

        const {data: updatedDocumentData, error: documentError} = await supabase
        .from("documents")
        .update({status: "processing"})
        .eq("document_id", documentId)
        .select()
        .single()

        if(documentError) {
            throw new Error(documentError.message)
        }

        const currentUserId = updatedDocumentData.user_id
        userId = currentUserId


        //downloads document from storage

        sendDocumentStatus(currentUserId, documentId, "processing")


        const {data: downloadedDocumentData, error: downloadedDocumentError} = await supabase.storage
        .from("file_upload").download(filePath);

        if (!downloadedDocumentData || downloadedDocumentError) {
            throw new Error(downloadedDocumentError?.message || "Could not download document")
        }



        const rawPDFBytes = await downloadedDocumentData.arrayBuffer()
        const  pdf = await getDocumentProxy(new Uint8Array(rawPDFBytes))
        const {totalPages, text} = await extractText(pdf, {mergePages: true})

        if (text.length === 0) {
            throw new Error("Could not extract PDF text")
        }

        //creates document chunks
        const {chunkCount} = await textChunking(currentUserId, documentId, text, 100)



        return {
            chunkCount,
            totalPages,
            documentId,
        }

    } catch (error) {
        console.error(`Processing failed for document ${documentId}:`, error)

        await supabase.from("documents").update({status: "failed"}).eq("document_id", documentId)

        if (userId) {
            sendDocumentStatus(userId, documentId, "failed")
        }
    }


}