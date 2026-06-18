

import { supabase } from "./client"



export const uploadFileToStorage = async(userId: string, filePath: string, file: File) => {
const {data, error} = await supabase.storage.from("file_upload").upload(`users/${userId}/${filePath}`, file)

return {data, error}
    
}