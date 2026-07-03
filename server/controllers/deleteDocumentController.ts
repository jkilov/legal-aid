
import type {Request, Response, NextFunction} from "express"
import { deleteDocument } from "../services/deleteDocument"

export const deleteDocumentController = async (req: Request, res: Response, next: NextFunction) => {


    try {
        const documentId = req.body.documentId

        if (!documentId) throw new Error("Document Id could not be found")


const deletedDocumentData= await deleteDocument(documentId)

        res.status(200).send({message: "Document successfully delete", data: deletedDocumentData})
    } catch (error) {
        next(error)
    }

}