import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { getDocumentFile } from "../api/documentsApi";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useRouteLoaderData } from "react-router";
import { toast } from "sonner";
import DocumentNavigation from "./DocumentNavigation";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface Props {
  documentId: string;
}

const DocumentViewer = ({ documentId }: Props) => {
  const [documentUrl, setDocumentUrl] = useState<any>();
  //TODO: FIX the type above

  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);

  const sessionId = useRouteLoaderData("protected");

  const resetDocument = () => {
    setTotalPages(null);
    setCurrentPage(null);
  };

  useEffect(() => {
    const fetchFile = async () => {
      const blob = await getDocumentFile(documentId, sessionId.access_token);

      const fileUrl = URL.createObjectURL(blob);

      resetDocument();
      setDocumentUrl(fileUrl);
    };

    fetchFile();
  }, [documentId, sessionId.access_token]);

  const handleLoadSuccess = (pdf) => {
    setTotalPages(pdf.numPages);
    setCurrentPage(1);
  };

  const handleLoadError = () => {
    toast.error("There was an error loading your PDF");
    return "Error loading PDF";
  };

  const handleDocumentNavigation = (change: number) => {
    setCurrentPage((prev) => prev + change);
  };

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto">
        <Document
          onLoadSuccess={handleLoadSuccess}
          noData={<p>Loading...</p>}
          error={<p>Error Loading Document</p>}
          file={documentUrl}
          onLoadError={handleLoadError}
        >
          <Page
            pageNumber={currentPage}
            renderTextLayer
            renderAnnotationLayer
          />
        </Document>
      </div>

      {totalPages && (
        <DocumentNavigation
          totalDocumentPages={totalPages}
          currentDocumentPage={currentPage}
          onDocumentNavigation={handleDocumentNavigation}
        />
      )}
    </div>
  );
};

export default DocumentViewer;
