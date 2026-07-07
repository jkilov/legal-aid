import type {Request, Response, NextFunction} from "express"
import { uploadUserQuery } from "../services/uploadUserQuery"

export const queryDocumentsController = async (req: Request, res: Response, next: NextFunction) => {

try {


    const {query} = req.body
    const documentId = req.params.documentId
    const userId = req.user.id


    if (!query) throw new Error("Cannot find query data for upload")
    if (!documentId) throw new Error("Cannot find document details")
    if(!userId) throw new Error("No user found")



 await uploadUserQuery(userId, query, documentId)

        return res.status(200).send("upload complete")
    
} catch (error) {
    next(error)
}

}   