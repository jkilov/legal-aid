import { useState } from "react";
import Documents from "../components/Documents";
import DocumentSearch from "../components/DocumentSearch";
import RagAnswer from "../components/RagAnswer";
import DocumentViewer from "../components/DocumentViewer";
import type { AllDocuments } from "../../shared/types";
import { useSearchParams } from "react-router";

const DocumentQueryPage = () => {
  const [selectedDocument, setSelectedDocument] = useState<AllDocuments | null>(
    null
  );
  const [selectedCitationId, setSelectedCitationId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSelectDocument = (document: AllDocuments) => {
    setSelectedDocument(document);
    setSearchParams({ id: document.document_id });
  };

  const id = searchParams.get("id");

  const handleUserSelectedCitation = (chunkId: string): void => {
    setSelectedCitationId(chunkId);
    console.log("CI", chunkId);
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
          <DocumentViewer
            documentId={selectedDocument.document_id}
            selectedCitationId={selectedCitationId}
          />
        ) : (
          "No Document Selected"
        )}
      </section>

      <main className="flex flex-col items-center flex-3">
        <DocumentSearch
          key={id}
          documentId={id}
          documentName={selectedDocument?.document_name}
          onSelectCitation={handleUserSelectedCitation}
        />
      </main>
    </div>
  );
};

export default DocumentQueryPage;

//TODO: Why is this page loading when im open on the document library page
