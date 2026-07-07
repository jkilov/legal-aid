import { useEffect } from "react";
import { useRouteLoaderData } from "react-router";
import type { AllDocuments } from "../../shared/types";
import { toast } from "sonner";
import { getDocumentsLibrary } from "../api/documentsApi";

interface Props {
  documents: AllDocuments[];
  onUpdateDocumentLibrary: (documentLibrary: AllDocuments[]) => void;
}
const DocumentList = ({ documents, onUpdateDocumentLibrary }: Props) => {
  const sessionData = useRouteLoaderData("protected");

  const handleDelete = async (documentId: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/documents/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentId }),
      }
    );
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      toast.error(errorBody.message || "There was an error deleting your document");
      return;
    }
    toast.success("Document Deleted");
    try {
      const documentLibrary = await getDocumentsLibrary(sessionData.access_token);
      onUpdateDocumentLibrary(documentLibrary);
    } catch {
      toast.error("Could not refresh your document list");
    }
  };

  return (
    <div>
      <h2>Uploaded Document List</h2>
      {documents.map(
        ({ document_id: documentId, document_name: documentName, status }) => (
          <div key={documentId}>
            <h2>
              {documentName}:{" "}
              <span onClick={() => handleDelete(documentId)}>delete</span>
            </h2>
            <h2>{status}</h2>
          </div>
        )
      )}
    </div>
  );
};

export default DocumentList;
