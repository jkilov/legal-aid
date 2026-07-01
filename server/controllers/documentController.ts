import type {Request, Response, NextFunction} from "express"
import { chunkDocumentService } from "../services/chunkDocumentService"
import { handleUploadDocument } from "../services/uploadDocumentService"
import { supabase } from "../config/supabase"


export const uploadDocument = async(req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.user) throw new Error("unable to find user details")
    const userId = req.user.id
    const file = req.file
    let docId = null
    
    if (!file) {
        throw new Error("No file uploaded")
    }


    const documentName = file.originalname

    if (!userId) {
        throw new Error("No user Authenticated)")
    }


   
  
        const {documentId, filePath} = await handleUploadDocument(documentName, file, userId)
 
        const {totalPages, chunkCount, status,} = await chunkDocumentService(documentId, filePath)

        // return res.status(200).send({totalPages, chunkCount, status})
        return res.status(200).send(JSON.stringify("AAASSSSSSSSSSSSSSSS"))

    } catch (error) {

        next(error)

    }

}