import express from "express"
import { errorHandler } from "../middleware/errorHandler"
import { documentRoutes } from "../routes/documentRoutes"
import cors from "cors"

export const app = express()

app.use(cors())
app.use(express.json())

app.use("/documents", documentRoutes )


app.use(errorHandler)