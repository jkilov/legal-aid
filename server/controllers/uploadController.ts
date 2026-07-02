import type { Request, Response, NextFunction } from "express";
import { chunkDocumentService } from "../services/chunkDocumentService";
import { handleUploadDocument } from "../services/uploadDocumentService";


export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new Error("unable to find user details");
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      throw new Error("No file uploaded");
    }

    const fileName = file.originalname;

    if (!userId) {
      throw new Error("No user Authenticated)");
    }

    const {
      documentName,
      documentId,
      filePath,
      status,
      createdAt,
    } = await handleUploadDocument(fileName, file, userId);

     await chunkDocumentService(documentId, filePath);

    // return res.status(200).send({totalPages, chunkCount, status})
    return res.status(200).send({ documentName, documentId, filePath, status, createdAt });
  } catch (error) {
    next(error);
  }
};
