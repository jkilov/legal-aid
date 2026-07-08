
import {supabase} from "../config/supabase"


export const updateQueryTableWithEmbeddings = async(embedding: number[], questionId: string) => {

 const {data, error} = await supabase.from("questions")
.update({embedding,})
.eq("question_id", questionId)
.select()
.single()

if(error || !data) throw new Error ("Unable to update user query table")

return data
}