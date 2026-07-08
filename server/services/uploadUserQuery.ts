import {supabase} from "../config/supabase"


export type QueryData = {
    user_id: string,
    question_id: string,
    question: string,
    document_id: string,
}

export const uploadUserQuery = async (userId: string, userQuery: string, documentId: string): Promise<QueryData> => {

const {data: queryData, error: queryError} = await supabase.from("questions")
.insert({
    user_id: userId,
    question: userQuery,
    document_id: documentId
})
.select()
.single()

if (queryError || !queryData) throw new Error("unable to store user query")

return queryData

}

