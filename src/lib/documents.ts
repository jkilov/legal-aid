import { supabase } from "./client";



//Status types:
//Uploaded
//Processing
//Ready
//Failed

export const createDocument = async (userId: string, documentName: string, documentPath: string) => {

    const {data, error} = await supabase
    .from("documents")
    .insert({user_id: userId, document_name: documentName, document_path: documentPath, status: "Uploaded"})

    return {data, error}

}