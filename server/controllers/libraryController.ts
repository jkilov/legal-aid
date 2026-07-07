
import type {Request, Response, NextFunction} from "express"

import { retrieveAllDocuments } from "../services/retrieveAllDocuments"



export const retrieveAllDocumentsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const user = req.user.id
        if(!user) throw new Error("No user id Found")

          const allDocuments =  await retrieveAllDocuments(user)

          res.status(200).send(allDocuments)

    } catch (error) {
        next(error)
        
    }


}