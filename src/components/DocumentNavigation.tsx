import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

interface Props {
  totalDocumentPages: number;
  currentDocumentPage: number;
  onDocumentNavigation: (operator: any) => void;
}

const DocumentNavigation = ({
  currentDocumentPage,
  totalDocumentPages,
  onDocumentNavigation,
}: Props) => {
  return (
    <div className="flex justify-between items-center absolute bottom-10 left-1/2 z-50 w-40 -translate-x-1/2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-black shadow-lg backdrop-blur-md">
      <button
        onClick={() => onDocumentNavigation(-1)}
        disabled={currentDocumentPage === 1}
      >
        <IoIosArrowBack />
      </button>
      <p>
        {currentDocumentPage} / {totalDocumentPages}
      </p>
      <button
        onClick={() => onDocumentNavigation(1)}
        disabled={currentDocumentPage === totalDocumentPages}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default DocumentNavigation;
