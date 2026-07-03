import { supabase } from "../config/supabase"

export const deleteDocument = async(documentId: string[]) => {

    console.log("DP", documentId)
    const {data: deletedDocumentData, error: deleteError} = await supabase.from("documents").delete().eq("document_id", documentId)

    if (!deletedDocumentData || deleteError) throw new Error("Could not delete Document")

    return deletedDocumentData
}