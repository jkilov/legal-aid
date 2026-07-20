
import {supabase} from "../config/supabase"

export const retrieveDocument = async(filePath: string): Promise<Blob> => {

const {data,  error} = await supabase.storage.from("file_upload").download(filePath)

if (error || !data) {
throw new Error("Unable to retrieve document")
}

const fileBlob = new Blob([data], {
    type: "application/pdf"
}) 





return fileBlob

}