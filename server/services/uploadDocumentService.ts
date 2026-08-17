import {supabase} from "../config/supabase"
import {sendDocumentStatus} from "../src/webSocket"

export const handleUploadDocument = async(documentName: string, file: Express.Multer.File, description: string, userId: string ) => {

  
const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

    if (!file) {
        throw new Error("There was an issue with the uploaded file")
    }

    if (!allowedFileTypes.includes(file.mimetype)) {
        throw new Error("File type unsupported)")
    }

    const filePath = `users/${userId}/${documentName}`



    const {data: createDocument, error: createDocumentError} = await supabase.from("documents")
    .insert({
        user_id: userId,
        document_name: documentName,
        document_path: filePath,
        status: "uploading", 
        description
    })
    .select()
    .single()


    
if (createDocumentError || !createDocument){
    throw new Error("There was an issue creating your document")
}

sendDocumentStatus(userId, createDocument.document_id, "uploading")


    const {data: uploadedDocumentData, error: uploadedDocumentError} = await supabase.storage.from("file_upload")
    .upload(filePath, file.buffer, {
        contentType: "application/pdf",
        cacheControl: "3600",
    })


    if (uploadedDocumentError || !uploadedDocumentData) {
        await supabase.from("documents").delete().eq("document_id", createDocument.document_id )
        throw new Error("There was an issue uploading file")
    }

    sendDocumentStatus(userId, createDocument.document_id, "uploaded")

    await supabase.from("documents").update({status: "uploaded"}).eq("document_id", createDocument.document_id)



return {
    documentName: createDocument.document_name,
    documentId: createDocument.document_id,
    filePath,
    status: createDocument.status,
    createdAt: createDocument.created_at
}

}