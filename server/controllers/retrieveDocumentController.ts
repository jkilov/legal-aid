import type {Request, Response, NextFunction} from "express"
import {retrieveDocument} from "../services/retrieveDocumnetService"
import { getDocumentPath } from "../services/getDocumentPath"

export const retrieveDocumentController = async (req: Request, res: Response, next: NextFunction) => {


    const documentId = req.params.documentId
 

    if (!documentId || typeof documentId !== "string") throw new Error("document ID not found")

        try {
            const filePath = await getDocumentPath(documentId)

            const fileBlob= await retrieveDocument(filePath)


       
            return res.status(200).send(fileBlob)
        } catch (error) {
            next(error)
        }
}