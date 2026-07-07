// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from "npm:@supabase/supabase-js@2";


const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

Deno.serve(async (req) => {


  
  
  try {

    const webhookSecret = req.headers.get("x-webhook-secret");

    if (webhookSecret !== Deno.env.get("CLEANUP_WEBHOOK_SECRET")) {
      return new Response("Unauthorized", {status: 401})
    }

    const payload = await req.json()

    if (!payload.record) {
      return new Response(JSON.stringify({
        ok: false,
        error: "Missing record in webhook payload"
      }), {
        status: 400,
        headers: {"Content-Type": "application/json"}
      })
    }

    const job = payload.record;
  const jobId = job.id
  const userId = job.user_id
  const documentName = job.document_name


  let filePaths: string[];

  if (documentName) {

    filePaths = [`users/${userId}/${documentName}`]
  } else {
    const {data: files, error: listError} = await supabase.storage
    .from("file_upload")
    .list(`users/${userId}`)

    if (listError) throw listError

    filePaths = files?.map( file => `users/${userId}/${file.name}`) ?? [];
  }

if (filePaths.length > 0) {
  const {error: removeError} = await supabase.storage.from("file_upload").remove(filePaths);

  if (removeError) throw removeError

}

await supabase
.from("storage_cleanup_jobs")
.update({
  status: "done",
  completed_at: new Date().toISOString()
})
.eq("id", jobId)

return new Response(JSON.stringify({
  ok: true,
  deletedFiles: filePaths.length
}),
{
  status: 200,
  headers: {"Content-Type": "application/json"}
}



)


  } catch (error) {
    console.log( error instanceof Error ? "error: " + error.message : "an Error occurred")
    return new Response(JSON.stringify({
      ok: false,
      error: error instanceof Error? error.message : String(error)
    }),
    {
      status: 500,
      headers: {"Content-Type": "application/json"}
          
        }
  )

  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/cleanup-user-storage' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
