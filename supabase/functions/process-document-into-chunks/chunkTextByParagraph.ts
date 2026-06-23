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

export const chunkTextByParagraph = async(documentId: string, text: string[], paragraphCount: number) => {
    let chunkOrder = 0



        for (let i = 0; i < text.length; i+= paragraphCount ) {
++chunkOrder
const chunkSlice = text.slice(i, i+ paragraphCount)

if (chunkSlice.length <= 0) return

const chunk = chunkSlice.join(" ")

const { error: chunkedError} = await supabase
.from("chunks")
.insert({
    document_id: documentId,
    chunk,
    chunk_order: chunkOrder,
    doc_order_number: i + paragraphCount,
    chunk_condition: "paragraph"

})

if (chunkedError) throw new Error(chunkedError)

        }
        console.log("chunked by paragraph")


}