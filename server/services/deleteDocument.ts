import { supabase } from "../config/supabase"

export const deleteDocument = async(documentId: string): Promise<void> => {

  
    const response = await supabase.from("documents").delete().eq("document_id", documentId)

    if (!response) throw new Error("Could not delete Document")


}