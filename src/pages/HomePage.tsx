import { useState } from "react";

import UploadFile from "../components/UploadFile";
import DocumentList from "../components/DocumentList";

import type { AllDocuments } from "../../shared/types";

const HomePage = () => {
  const [documentData, setDocumentData] = useState<AllDocuments[]>([]);

  const handleDocumentUploaded = (uploadedDocument: AllDocuments[]) => {
    setDocumentData(uploadedDocument);
  };

  console.log("documentData", documentData);

  return (
    <div>
      <UploadFile onDocumentUploaded={handleDocumentUploaded} />
      <DocumentList documents={documentData} />
    </div>
  );
};

export default HomePage;
