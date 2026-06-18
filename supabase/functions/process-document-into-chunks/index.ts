// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import {extractText, getDocumentProxy } from "unpdf"
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

//TODO: need dotenv to acces env file



console.log("Hello from Functions!")

Deno.serve(async (req) => {

  try {
// const body = req.json()
// const filePath = body.filePath
// const userId = body.userId

const filePath = "ASP001920230510310505.pdf"
const userId = "bd4e50b0-ed0c-4d28-aee2-ed3864091b14"

// const {error: statusUpdateError} = await supabase.from("documents")
// .update({documents: "Processing"})
// .eq("document_path", filePath)

// if (statusUpdateError) {
//   throw new Error (statusUpdateError)
// }

const {data, error} = await supabase.storage.from("file_upload")
.download(`users/${userId}/${filePath}`)

console.log("D", data)

if (error) {
  throw new Error(error.message)
}


return new Response(JSON.stringify({"data": data}))



    
  } catch (error) {
    console.log(error)

    return new Response(JSON.stringify({"error": error}))
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
