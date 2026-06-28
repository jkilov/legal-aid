import {supabase} from "../config/supabase"
import {extractText, getDocumentProxy} from "unpdf"
import { textChunking } from "./chunking"

export const chunkDocumentService = async(documentId: string, filePath: string) => {


    //update document status

    const { error: documentError} = await supabase
    .from("documents")
    .update({status: "Processing"})
    .eq("document_id", documentId)

    if(documentError) {
        throw new Error(documentError.message)
    }

    //downloads document from storage

    const {data: downloadedDocumentData, error: downloadedDocumentError} = await supabase.storage
    .from("file_upload").download(filePath);

    if (!downloadedDocumentData || downloadedDocumentError) {
        throw new Error(downloadedDocumentError.message)
    }

    const rawPDFBytes = await downloadedDocumentData.arrayBuffer()
    const  pdf = await getDocumentProxy(new Uint8Array(rawPDFBytes))
    const {totalPages, text} = await extractText(pdf, {mergePages: true})

    if (text.length === 0) {
        throw new Error("Could not extract PDF text)")
    }

    //creates document chunks
    const {chunkCount} = await textChunking(documentId, text, 300)

    return {
        totalPages,
        chunkCount,
        status: "Document chunking processed"
    }


}