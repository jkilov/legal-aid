import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { getDocumentFile } from "../api/documentsApi";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useRouteLoaderData } from "react-router";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface Props {
  documentId: string;
}

const DocumentViewer = ({ documentId }: Props) => {
  const [documentUrl, setDocumentUrl] = useState<any>();

  const sessionId = useRouteLoaderData("protected");

  useEffect(() => {
    const fetchFile = async () => {
      const blob = await getDocumentFile(documentId, sessionId.access_token);

      console.log("HT", blob);

      const fileUrl = URL.createObjectURL(blob);
      setDocumentUrl(fileUrl);
    };

    fetchFile();
  }, [documentId, sessionId.access_token]);

  console.log("documentViwer", documentUrl);

  return (
    <div>
      <h3>Viewer</h3>
      <Document
        file={documentUrl}
        onLoadError={(error) => console.error("PDF load error:", error)}
      >
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default DocumentViewer;
