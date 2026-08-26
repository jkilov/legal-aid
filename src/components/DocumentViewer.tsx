import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { getDocumentFile } from "../api/documentsApi";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useRouteLoaderData } from "react-router";
import { toast } from "sonner";
import DocumentNavigation from "./DocumentNavigation";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

type Citation = {
  index: number;
  text: string;
};

interface Props {
  documentId: string;
  selectedCitationId: string;
}

const DocumentViewer = ({ documentId, selectedCitationId }: Props) => {
  const [documentUrl, setDocumentUrl] = useState<any>();
  //TODO: FIX the type above

  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);

  const sessionId = useRouteLoaderData("protected");

  const pageRef = useRef(null);

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

  const checkText = (textArr: Citation[], spans: NodeList) => {
    textArr.forEach((text) => {
      if (selectedCitationId.includes(text.text)) {
        spans[text.index].style.backgroundColor = "rgba(255, 255, 0, 0.4)";
      }
    });
  };

  //TODO: now i need to find the right span by the index and update the text there

  const handleSpanAccess = () => {
    if (pageRef.current) {
      const divs = pageRef.current.querySelectorAll("div");
      const textDiv = divs[2];
      const spans = textDiv.querySelectorAll("span");

      const spanArr = Array.from(spans, (span, index) => ({
        index,
        text: span.textContent,
      }));

      checkText(spanArr, spans);
    }
  };

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto" ref={pageRef}>
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
            onRenderTextLayerSuccess={handleSpanAccess}
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
