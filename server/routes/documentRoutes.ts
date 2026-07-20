import multer from "multer"
import {Router} from "express"
import {uploadDocument} from "../controllers/uploadController.ts"
import { retrieveAllDocumentsController } from "../controllers/libraryController.ts"
import {deleteDocumentController} from "../controllers/deleteDocumentController.ts"
import { requireAuth } from "../middleware/requireAuth.ts"
import { queryDocumentsController } from "../controllers/queryDocumentsController.ts"
import { retrieveDocumentController } from "../controllers/retrieveDocumentController.ts"

export const documentRoutes = Router()
const upload = multer()

documentRoutes.post("/upload", requireAuth, upload.single("file"), uploadDocument)

documentRoutes.get("/library", requireAuth, retrieveAllDocumentsController)

documentRoutes.delete("/delete", requireAuth, deleteDocumentController)


//TODO: the below is duplication - must fix
documentRoutes.post("/:documentId/query", requireAuth, queryDocumentsController)
documentRoutes.get("/:documentId/view", requireAuth, retrieveDocumentController )