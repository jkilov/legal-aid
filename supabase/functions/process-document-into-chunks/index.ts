// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import {extractText, getDocumentProxy } from "unpdf"
import {createClient} from "@supabase/supabase-js"
import {chunkTextBywordCount} from "./chunkTextBywordCount.ts"




const supabaseUrl =   Deno.env.get("TEST_SUPABASE_URL")!
const supabaseKey = Deno.env.get("TEST_SUPABASE_SERVICE_ROLE_KEY")!

if (!supabaseUrl || !supabaseKey) {
  throw new Error("missing url or key")
}

const supabase = createClient(
  supabaseUrl, 
  supabaseKey
)





console.log("server started")

Deno.serve(async (req) => {

  try {
//     if (!req) {
//       throw new Error("Request not found")
//     }
// const body = req.json()
// const filePath = body.filePath
// const userId = body.userId
//const documentId = body.documentId

const userId = "98eb8ceb-1c2f-4677-a116-0df30f427cf6"
const filePath = "pedlar_contract.pdf"
const documentId ="93032e77-768e-46aa-a158-4dabbe99f496"



//change status to Processing
const {error: statusUpdateError} = await supabase.from("documents")
.update({status: "Processing"})
.eq("document_path", filePath)

if (statusUpdateError) {
  throw new Error (statusUpdateError.message)
}


//Download PDF
const {data: downloadedFile, error: downloadError} = await supabase.storage.from("file_upload")
.download(`users/${userId}/${filePath}`)

if (downloadError || !downloadedFile) {
  throw new Error(downloadError.message)
}



const pdfBytes = await downloadedFile.arrayBuffer()



const pdf = await getDocumentProxy(new Uint8Array(pdfBytes))


const {totalPages, text} = await extractText(pdf, {mergePages: true})

console.log("textTest", text.length)

if (text.length === 0) {
  throw new Error("There was an issue extracting the documents text")
}



console.log("total Page", totalPages)


const textArr = text.split(/\n\s*\n/)


if (textArr.length === 1) {
  const textToWordsArr = textArr.split (" ")
  //Creates an array with each element a word
  chunkTextBywordCount(documentId, textToWordsArr, 300)
} else {
  //add chunking function by paragraph
  chunkTextByParagraph(documentId, textArr, 4)

}




//TODO: if document has one array it means split was not successful and use char count, if has multiple paragraph split was good





return new Response(JSON.stringify({data: "ok"}))
    
  } catch (error) {


    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Something went wrong"}))
  }
 

})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process-document-into-chunks' \
    --header 'Content-Type: application/json' \
    --data '{
    "userId": "bd4e50b0-ed0c-4d28-aee2-ed3864091b14",
    "filePath":"ASP001920230510310505.pdf'

*/
// --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
