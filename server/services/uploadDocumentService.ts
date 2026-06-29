import {supabase} from "../config/supabase"

export const handleUploadDocument = async(documentName: string, file: Express.Multer.File, userId: string ) => {

  
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

    const filePath = `user/${userId}/${documentName}`

    const {data: uploadedDocumentData, error: uploadedDocumentError} = await supabase.storage.from("file_upload")
    .upload(filePath, file.buffer)

    if (uploadedDocumentError || !uploadedDocumentData) {
        throw new Error("There was an issue uploading file")
    }

    const {data: createDocument, error: createDocumentError} = await supabase.from("documents")
    .insert({
        user_id: userId,
        document_name: documentName,
        document_path: filePath,
        status: "uploaded"
    })
    .select()

    
if (createDocumentError || !createDocument){
    throw new Error("There was an issue creating your document")
}

return {
    documentId: createDocument[0].document_id,
    filePath: `users/${createDocument[0].document_path}`,
    status: createDocument[0].status
}

}