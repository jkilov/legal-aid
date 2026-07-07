import type { Request, Response, NextFunction } from "express";
import { chunkDocumentService } from "../services/chunkDocumentService";
import { handleUploadDocument } from "../services/uploadDocumentService";



const sleep = (attempt: number) => {
const backOffTime = 1000
  return new Promise(resolve => {
setTimeout(resolve, attempt* backOffTime)
  })
}

export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const maxRetries = 4
  let attemptCount = 0

  while (true) {

    if (attemptCount > maxRetries) return next({status: 400, message: "Maximum retries"})

    
      
      const userId = req.user.id;
      const file = req.file;
      if (!req.user) return next({status: 400, message: "No user Found"});

      if (!userId) return next({status: 400, message: "Cannot find user Id"})
      if (!file) return next({status: 400, message: "No file found"})
  
      const fileName = file.originalname;
  
      try {

        
      const {
        documentName,
        documentId,
        filePath,
        status,
        createdAt,
      } = await handleUploadDocument(fileName, file, userId);
  
        chunkDocumentService(documentId, filePath);
  
      return res.status(200).send({ documentName, documentId, filePath, status, createdAt });

    } catch (error) {
      ++attemptCount
      console.error(error instanceof Error ? `${maxRetries} - ${attemptCount} remaining: ` + error.message : "something went wrong")
      await sleep(attemptCount)
    }

  }
 
};
