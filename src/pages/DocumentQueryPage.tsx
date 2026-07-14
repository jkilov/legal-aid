import DocumentSearch from "../components/DocumentSearch";
import RagAnswer from "../components/RagAnswer";

const DocumentQueryPage = () => {
  return (
    <div className="flex flex-row h-screen">
      <div className="w-1/4 border-r">document Library</div>
      <div className=" flex flex-col justify-center items-center w-3/4">
        <RagAnswer />
        <DocumentSearch
        //   selectedDocument={selectedDocument}
        />
      </div>
    </div>
  );
};

export default DocumentQueryPage;
