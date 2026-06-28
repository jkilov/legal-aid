import multer from "multer"
import {Router} from "express"
import {uploadDocument} from "../controllers/documentController.ts"
import { requireAuth } from "../middleware/requireAuth.ts"

export const documentRoutes = Router()
const upload = multer()

documentRoutes.post("/upload", requireAuth, upload.single("file"), uploadDocument)