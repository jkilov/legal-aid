import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Document, Thumbnail } from "react-pdf";
import { useRouteLoaderData } from "react-router";
import type { AllDocuments } from "../../shared/types";
import { getDocumentsLibrary } from "../api/documentsApi";

interface Props {
  onUpdateDocumentLibrary: (documentLibrary: AllDocuments[]) => void;
}

const UploadFile = ({ onUpdateDocumentLibrary }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectFileUrl, setSelectedFileUrl] = useState(null);

  const sessionData = useRouteLoaderData("protected");

  //TODO: refactor below - logic is too large
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
    setSelectedFile(file);
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
      const documentLibrary = await getDocumentsLibrary(accessToken);
      onUpdateDocumentLibrary(documentLibrary);
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

      const documentLibrary = await allDocumentsResponse.json();
      onUpdateDocumentLibrary(documentLibrary);
    };
    runDocumentList();
  }, [sessionData.access_token]);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedFileUrl(null);
      return;
    }

    const documentUrl = URL.createObjectURL(selectedFile);
    setSelectedFileUrl(documentUrl);

    return () => URL.revokeObjectURL(documentUrl);
  }, [selectedFile]);

  return (
    <div className="flex flex-col gap-4">
      <h2>Upload Legal document</h2>
      {selectFileUrl && (
        <div className="flex flex-col items-center gap-4">
          <Document file={selectFileUrl} className="">
            <Thumbnail pageNumber={1} width={300} />
          </Document>
          <p className="font-bold">{selectedFile?.name ?? ""}</p>
          <textarea
            className="border resize-none rounded-xl"
            placeholder="Add a document description"
            rows={5}
            cols={50}
          />
        </div>
      )}

      <div className="flex justify-between pt-1">
        <label>
          Choose Document{" "}
          <input
            className="hidden"
            type="file"
            name="docUpload"
            id="docUpload"
            accept=".doc, .docx, .pdf"
            onChange={handleSelectFile}
          />
        </label>
        {selectedFile && (
          <button
            type="button"
            onClick={() => {
              if (!selectedFile) {
                toast.error("Please select a file first");
                return;
              }
              handleUploadFile(sessionData.access_token, selectedFile);
            }}
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
