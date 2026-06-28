import { supabase } from "../config/supabase"

export const textChunking = async (documentId: string, text: string, chunkGroup: number): Promise<{chunkCount: number}> => {


    let chunkCount = 0

    const textArray = text.split(" ")

    for (let i = 0; i < textArray.length; i += chunkGroup){
        ++chunkCount
     const chunkSection = textArray.slice(i, i + chunkGroup)

if (chunkSection.length === 0) {
break;
}

     const chunk = chunkSection.join(" ")

     const {data: chunkedData, error: saveChunkError} = await supabase
     .from("chunks")
     .insert ({
        document_id: documentId,
        chunk,
        chunk_order: chunkCount,
        doc_order_number: i + chunkGroup,
        chunk_condition: "Word"

     })

     if (saveChunkError) throw new Error(saveChunkError.message)

    }

    return {chunkCount}

}

//TODO: make chunk condition enum Word, Character, Paragraph, Page