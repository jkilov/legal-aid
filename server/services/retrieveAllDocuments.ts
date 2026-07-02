import {supabase} from "../config/supabase"

import type {AllDocuments} from "../../shared/types"

export const retrieveAllDocuments = async(userId: string): Promise<AllDocuments[]> => {

   if (!userId) throw new Error("No userID found")

    const {data: allDocumentsData, error: allDocumentsError} = await supabase.from("documents")
    .select()
    .eq("user_id", userId)

    if (allDocumentsError || !allDocumentsData) throw new Error("There was an issue retrieving user documents")


        return allDocumentsData
}


