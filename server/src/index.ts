import "dotenv/config"
import http from "http"
import { app } from "./app"
import { setupWebSocket } from "./webSocket"


const PORT = 3000

const server = http.createServer(app)

setupWebSocket(server)




server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})