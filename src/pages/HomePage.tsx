import { useState, useEffect } from "react";

import UploadFile from "../components/UploadFile";
import DocumentList from "../components/DocumentList";

import { useRouteLoaderData } from "react-router";
export type DocumentSearchItem = Pick<
  AllDocuments,
  "document_id" | "document_name"
>;

const HomePage = () => {
  const [documentData, setDocumentData] = useState<AllDocuments[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentSearchItem | null>(null);
  //TODO: use this later for an onclick for the selected document
  const session = useRouteLoaderData("protected");

  const handleUpdateDocumentLibrary = (uploadedDocument: AllDocuments[]) => {
    setDocumentData(uploadedDocument);
  };

  const handleSelectDocument = (
    documentId: string,
    documentName: string
  ): void => {
    setSelectedDocument({
      document_id: documentId,
      document_name: documentName,
    });
  };

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:3000?token=${session.access_token}`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setDocumentData((prev) =>
        prev.map((document) =>
          document.document_id === data.documentId
            ? { ...document, status: data.status }
            : document
        )
      );
    };

    return () => socket.close();
  }, [session.access_token]);

  return (
    <div>
      <UploadFile onUpdateDocumentLibrary={handleUpdateDocumentLibrary} />
      <DocumentList
        documents={documentData}
        onUpdateDocumentLibrary={handleUpdateDocumentLibrary}
        onSelectDocument={handleSelectDocument}
      />
    </div>
  );
};

export default HomePage;
