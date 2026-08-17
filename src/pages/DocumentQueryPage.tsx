import { useState } from "react";
import Documents from "../components/Documents";
import DocumentSearch from "../components/DocumentSearch";
import RagAnswer from "../components/RagAnswer";
import DocumentViewer from "../components/DocumentViewer";
import type { AllDocuments } from "../../shared/types";

const DocumentQueryPage = () => {
  const [selectedDocument, setSelectedDocument] = useState<AllDocuments>();

  const handleSelectDocument = (document: AllDocuments) => {
    setSelectedDocument(document);
  };

  return (
    <div className="flex flex-row h-full">
      <aside className="w-1/6 border-r">
        document Library
        <div>
          <Documents onDocumentSelection={handleSelectDocument} />
        </div>
      </aside>

      <section className="relative flex-4 h-full overflow-hidden border-r">
        {selectedDocument ? (
          <DocumentViewer documentId={selectedDocument.document_id} />
        ) : (
          "No Document Selected"
        )}
      </section>

      <main className="flex flex-col items-center flex-3">
        <DocumentSearch />
      </main>
    </div>
  );
};

export default DocumentQueryPage;
