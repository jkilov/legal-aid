import type {Request, Response, NextFunction} from "express"
import { uploadUserQuery, type QueryData } from "../services/uploadUserQuery"
import { createUserQueryEmbeddings } from "../services/userQueryEmbeddings"
import {updateQueryTableWithEmbeddings} from "../services/updateQueryTable"

export const queryDocumentsController = async (req: Request, res: Response, next: NextFunction) => {

try {


    const {query} = req.body
    const documentId = req.params.documentId
    const userId = req.user.id


    if (!query) throw new Error("Cannot find query data for upload")
    if (typeof query !== "string" || !query.trim()) throw new Error("Invalid query")
    if (!documentId) throw new Error("Cannot find document details")
    if (typeof documentId  !== "string" || !documentId.trim()) throw new Error("invalid document ID")
    if(!userId) throw new Error("No user found")


 const queryData: QueryData = await uploadUserQuery(userId, query, documentId)

if (!queryData) throw new Error("unable to find row data required")



 const embedding = await createUserQueryEmbeddings(query)


 const data = await updateQueryTableWithEmbeddings(embedding, queryData.question_id)


        return res.status(200).send({message: "upload complete", data})
    
} catch (error) {
    next(error)
}

}   