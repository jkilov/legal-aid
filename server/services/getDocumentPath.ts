import { supabase } from "../config/supabase"

export const getDocumentPath = async(documentId: string) => {

    const {data, error} = await supabase
    .from("documents")
    .select("document_path")
    .eq("document_id", documentId)
    .single()

    if(error || !data) throw new Error(error.message)

return data.document_path

}