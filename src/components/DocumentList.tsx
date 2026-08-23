import { useRouteLoaderData } from "react-router";
import type { AllDocuments } from "../../shared/types";
import { toast } from "sonner";
import { getDocumentsLibrary } from "../api/documentsApi";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface Props {
  documents: AllDocuments[];
  onUpdateDocumentLibrary: (documentLibrary: AllDocuments[]) => void;
  onSelectDocument: (documentId: string, documentName: string) => void;
}
const DocumentList = ({
  documents,
  onUpdateDocumentLibrary,
  onSelectDocument,
}: Props) => {
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
      toast.error(
        errorBody.message || "There was an error deleting your document"
      );
      return;
    }
    toast.success("Document Deleted");
    try {
      const documentLibrary = await getDocumentsLibrary(
        sessionData.access_token
      );
      onUpdateDocumentLibrary(documentLibrary);
    } catch {
      toast.error("Could not refresh your document list");
    }
  };

  return (
    <div className="flex  flex-col ">
      <h2>Uploaded Document List</h2>

      {documents.map(
        ({ document_id: documentId, document_name: documentName, status }) => (
          <ul
            key={documentId}
            className="grid grid-cols-[2fr_1fr_1fr]  w-[550px] mx-auto my-2 py-2"
          >
            <li
              onClick={() => onSelectDocument(documentId, documentName)}
              className="font-bold text-left truncate"
            >
              {documentName}
            </li>
            <li>{status}</li>
            <li className="justify-self-center">
              <AiOutlineCloseCircle onClick={() => handleDelete(documentId)} />
            </li>
          </ul>
        )
      )}
    </div>
  );
};

export default DocumentList;
