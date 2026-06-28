// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import {createClient} from "@supabase/supabase-js"

const supabaseUrl = Deno.env.get("TEST_SUPABASE_URL")
const supabaseKey = Deno.env.get("TEST_SUPABASE_SERVICE_ROLE_KEY")

if (!supabaseUrl || !supabaseKey) {
  throw new Error("missing supabase url or key")
}

const supabase = createClient(
  supabaseUrl, supabaseKey
)

Deno.serve(async (req) => {



const authHeaders = req.header.get("Authorization")
const token = authHeaders.replace("Bearer", "")

const {data: {user}, error: authError} = await supabase.getUser(token)

if (!user) {
  throw new Error("No User Found")
}
if(authError){
  throw new Error("There was an error with your authorization")
}
 
const body = reqq.json()
const userId = body.userId
const filePath = body.filePath



const {error: createDocumentError} = await supabase.from("documents")
.insert({
  user_id: userId, document_name: documentName, document_path: filePath, status: "Uploaded"
})

if (createDocumentError) {
  throw new Error(createDocumentError.message)
}
  
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/upload-document' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
