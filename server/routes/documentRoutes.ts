import multer from "multer"
import {Router} from "express"
import {uploadDocument} from "../controllers/uploadController.ts"
import { retrieveAllDocumentsController } from "./libraryController.ts"
import { requireAuth } from "../middleware/requireAuth.ts"

export const documentRoutes = Router()
const upload = multer()

documentRoutes.post("/upload", requireAuth, upload.single("file"), uploadDocument)

documentRoutes.get("/library", requireAuth, retrieveAllDocumentsController)