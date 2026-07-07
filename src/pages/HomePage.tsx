import { useState, useEffect } from "react";

import UploadFile from "../components/UploadFile";
import DocumentList from "../components/DocumentList";

import type { AllDocuments } from "../../shared/types";
import { useRouteLoaderData } from "react-router";

const HomePage = () => {
  const [documentData, setDocumentData] = useState<AllDocuments[]>([]);

  const session = useRouteLoaderData("protected");

  const handleUpdateDocumentLibrary = (uploadedDocument: AllDocuments[]) => {
    setDocumentData(uploadedDocument);
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
      />
    </div>
  );
};

export default HomePage;
