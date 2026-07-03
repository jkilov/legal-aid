import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useRouteLoaderData } from "react-router";
import type { AllDocuments } from "../../shared/types";

interface Props {
  onDocumentUploaded: (uploadedDocument: AllDocuments[]) => void;
}

const UploadFile = ({ onDocumentUploaded }: Props) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const sessionData = useRouteLoaderData("protected");

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const handleUploadFile = async (accessToken: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/documents/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Successfully uploaded " + file.name);
      const allDocumentsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/documents/library`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const allDocuments = await allDocumentsResponse.json();
      onDocumentUploaded(allDocuments);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : " something went wrong"
      );
      //TODO: does this get swapped out for my handleAsyncFunction hook
    }
  };

  //TODO: THE ABOVE NEEDS TO BE REVIEWED AS IT WAS quick implementation

  useEffect(() => {
    const runDocumentList = async () => {
      const allDocumentsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/documents/library`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionData.access_token}`,
          },
        }
      );

      const allDocuments = await allDocumentsResponse.json();
      onDocumentUploaded(allDocuments);
    };
    runDocumentList();
  }, [sessionData.access_token]);

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
        onClick={() => {
          if (!uploadedFile) {
            toast.error("Please select a file first");
            return;
          }
          handleUploadFile(sessionData.access_token, uploadedFile);
        }}
      >
        Upload
      </button>
    </div>
  );
};

export default UploadFile;
