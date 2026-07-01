import { useState } from "react";

import UploadFile from "../components/UploadFile";
import UploadedDocumentList from "../components/UploadedDocumentList";

type DocumentData = {
  document_id: string;
  document_name: string;
  document_path: string;
  status: string;
  created_at: string;
};

const HomePage = () => {
  const [documentData, setDocumentData] = useState<DocumentData[]>([]);

  return (
    <div>
      <UploadFile />
      <UploadedDocumentList />
    </div>
  );
};

export default HomePage;
