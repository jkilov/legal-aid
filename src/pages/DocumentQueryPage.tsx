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

  console.log("documentQueryPage", selectedDocument);

  return (
    <div className="flex flex-row h-screen">
      <aside className="w-1/6 border-r">
        document Library
        <div>
          <Documents onDocumentSelection={handleSelectDocument} />
        </div>
      </aside>
      <section className="border-r flex-4">
        {selectedDocument ? (
          <DocumentViewer documentId={selectedDocument.document_id} />
        ) : (
          "No Document Selected"
        )}
      </section>
      <main className=" flex flex-col justify-center items-center flex-3">
        <RagAnswer />
        <DocumentSearch
        //   selectedDocument={selectedDocument}
        />
      </main>
    </div>
  );
};

export default DocumentQueryPage;
