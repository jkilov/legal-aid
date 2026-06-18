import { useState } from "react";
import { toast } from "sonner";
import { uploadFileToStorage } from "../lib/uploadFile";
import { createDocument } from "../lib/documents";
import { useRouteLoaderData } from "react-router";

const UploadFile = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const sessionData = useRouteLoaderData("protected");

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("There was an issue selecting your document");
      return;
    }

    const allowedType = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedType.includes(file.type)) {
      toast.error("Incompatible file type, Only .pdf, .doc and .docx accepted");
      return;
    }
    setUploadedFile(file);
    toast.success(`${file.name} selected`);
  };

  const handleUploadFile = async (
    userId: string,
    filePath: string,
    file: File
  ) => {
    console.log("storing");
    const { data: uploadedDocumentData, error: uploadedDocumentError } =
      await uploadFileToStorage(userId, filePath, file);
    if (!uploadedDocumentData || uploadedDocumentError) {
      toast.error(
        "There was an issue uploading your document: " +
          uploadedDocumentError.message
      );
      return;
    }

    const { error: insertedDocumentError } = await createDocument(
      userId,
      file.name,
      filePath
    );
    if (insertedDocumentError) {
      toast.error(
        "Could not store your document: " + insertedDocumentError.message
      );
      return;
    }

    toast.success("Successfully uploaded " + file.name);
    //note for review: i chose to upload the document in storage before writing the row because if it fails we can skip writing the row all together, rather than if we write the row and the upload fails we then need a seperate call to reverse. once you hav read this remind me to get rid of it
  };

  return (
    <div>
      <h2>Welcome to Legal-Aid</h2>
      <h3>Upload Legal document:</h3>
      <input
        type="file"
        name="docUpload"
        id="docUpload"
        accept=".doc, .docx, .pdf"
        onChange={handleSelectFile}
      />
      <button
        type="button"
        onClick={() =>
          handleUploadFile(sessionData.user.id, uploadedFile.name, uploadedFile)
        }
      >
        Upload
      </button>
    </div>
  );
};

export default UploadFile;
