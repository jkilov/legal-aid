import {createClient} from "@supabase/supabase-js"


const supabaseUrl =   Deno.env.get("TEST_SUPABASE_URL")!
const supabaseKey = Deno.env.get("TEST_SUPABASE_SERVICE_ROLE_KEY")!

if (!supabaseUrl || !supabaseKey) {
  throw new Error("missing url or key")
}

const supabase = createClient(
  supabaseUrl, 
  supabaseKey
)



export const chunkTextBywordCount = async(documentId: string, text: string[], wordCount: number) => {
    let chunkCount = 0
  

  
  
  for (let i = 0; i < text.length; i += wordCount) {
    ++chunkCount
    const chunkGrouping = text.slice(i, i + wordCount)
  
  if (chunkGrouping.length <= 0) return
  
    const chunk = chunkGrouping.join(" ")
  
    const {error: chunkedError} = await supabase
    .from("chunks")
    .insert({
      document_id: documentId,
      chunk,
      chunk_order: chunkCount,
      doc_order_number: i + wordCount,
      chunk_condition: "word Count"
    })
  
    if (chunkedError) {
      console.error("Chunk insert failed: " + chunkedError)
      throw new Error(chunkedError.message)
    }
  
  
  }
  

  console.log({"chunk method": Word})
  }
  