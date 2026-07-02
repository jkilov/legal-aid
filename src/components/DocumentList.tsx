import type { AllDocuments } from "../../shared/types";

interface Props {
  documents: AllDocuments[];
}

const DocumentList = ({ documents }: Props) => {
  console.log("documents", documents);
  return (
    <div>
      <h2>UploadedDocumdfdfdfdfdfdentList</h2>
      {documents.map((document) => (
        <div key={document.document_id}>
          <h2>{document.document_name}</h2>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
