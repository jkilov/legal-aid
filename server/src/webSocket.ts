import type {Server} from "http"
import { WebSocketServer, type WebSocket } from "ws"
import { supabase } from "../config/supabase"

export const DOCUMENT_STATUS = ["uploaded" , "uploading" , "processing",  "chunking" , "embedding" , "ready" , "failed"] as const
export type DocumentStatus = (typeof DOCUMENT_STATUS)[number]

const clients = new Map<string, WebSocket>()

export const setupWebSocket = (server: Server) => {

    const wss = new WebSocketServer({server})

    wss.on("connection", async (socket, request) => {


        const url = new URL(request.url ?? "",  "http://localhost:3000")

        const token = url.searchParams.get("token")

        if (!token) {
            socket.close()
            return;
        }

        const {data, error} = await supabase.auth.getUser(token)

        if (error || !data.user ) {
socket.close()
return
        }


        const userId = data.user.id

        clients.set(userId, socket)




        console.log(`client connected for ${userId}`)


        socket.send(JSON.stringify({
            userId,
            documentId: "4350cfab-0f85-4956-81b5-9cf6391e3576",
            status: "extracting_text"
        }))

     socket.on("close", () => {
        clients.delete(userId)
        console.log("Client Disconnected")})
    })

}

export const sendDocumentStatus = (userId: string, documentId: string, status: DocumentStatus) => {
    const socket = clients.get(userId)

    if (!socket) {
        console.log("No active socket for:", userId)
        return
    }

    socket.send(JSON.stringify({
        type: "document_status",
        documentId,
        status
    }))



}
