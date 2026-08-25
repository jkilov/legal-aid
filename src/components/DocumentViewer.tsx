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
}

const DocumentViewer = ({ documentId }: Props) => {
  const [documentUrl, setDocumentUrl] = useState<any>();
  //TODO: FIX the type above

  //TODO: HARDCODED
  const chunk =
    "Dear Hiring Manager, I am writing to apply for the Junior Software Developer position with Transport for NSW, working on the Opal Next Gen project. The opportunity to contribute to a large-scale, customer-facing platform that plays such an important role in how people travel across NSW is particularly appealing to me. My software development experience is centred around modern JavaScript and TypeScript technologies, including React, Node.js and Express. I have built full-stack applications involving responsive user interfaces, REST APIs, authentication, database integration, cloud services and deployment, giving me experience working across the development lifecycle and understanding how frontend, backend and infrastructure concerns come together to deliver a complete product. Alongside my technical background, I bring significant experience as a business owner. Running a business has given me a strong customer-focused mindset and an understanding that good technology needs to solve real problems, not simply meet technical requirements. It has required me to understand customer needs, make practical decisions, communicate with different stakeholders, take ownership of outcomes and continuously improve the experience being delivered. I believe this combination is particularly relevant to the role at Transport for NSW, where developers are expected to work closely with stakeholders, contribute to discovery and analysis, translate business requirements into effective technical solutions and help deliver high-quality customer experiences. One of my recent projects involved developing a full-stack document search and question-answering application using React, TypeScript, Node.js and Express. I worked across the application architecture, API development, authentication, document processing, database interactions and frontend experience. Through projects such as this, I have developed a strong appreciation for maintainable code, structured problem-solving and understanding how decisions in one part of a system affect the wider application. I am particularly excited by the opportunity to work on Opal Next Gen. The scale of the project, its direct";
  //TODO: HARDCODED

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
    textArr.forEach(
      (text) => {
        if (chunk.includes(text.text)) {
          spans[text.index].style.backgroundColor = "rgba(255, 255, 0, 0.4)";
          console.log("SP", spans[text.index]);
        }
      }
      // chunk.includes(text.text) ? text : console.log("false")
    );
  };

  //TODO: now i need to find the right span by the index and update the text there

  const handleSpanAccess = () => {
    if (pageRef.current) {
      const divs = pageRef.current.querySelectorAll("div");
      const textDiv = divs[2];
      const spans = textDiv.querySelectorAll("span");
      console.log(spans);

      const spanArr = Array.from(spans).map((span, index) => ({
        index,
        text: span.textContent,
      }));

      console.log("SP", spanArr);

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
