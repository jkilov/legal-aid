import { useRouteLoaderData } from "react-router";
import type { AllDocuments } from "../../shared/types";

interface Props {
  documents: AllDocuments[];
}
const DocumentList = ({ documents }: Props) => {
  const sessionData = useRouteLoaderData("protected");

  //TODO: the below is temporay to remove and redo properly

  const handleDelete = async (documentId: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/documents/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionData.access_token}`,
        },
        body: JSON.stringify({ documentId: documentId }),
      }
    );

    console.log("Res", response);
  };

  return (
    <div>
      <h2>Uploaded Document List</h2>
      {documents.map(
        ({ document_id: documentId, document_name: documentName }) => (
          <div key={documentId}>
            <h2>
              {documentName}:{" "}
              <span onClick={() => handleDelete(documentId)}>delete</span>
            </h2>
          </div>
        )
      )}
    </div>
  );
};

export default DocumentList;
