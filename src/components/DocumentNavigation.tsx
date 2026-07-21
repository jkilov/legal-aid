import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

interface Props {
  totalDocumentPages: number;
  currentDocumentPage: number;
}

const DocumentNavigation = ({
  currentDocumentPage,
  totalDocumentPages,
}: Props) => {
  return (
    <div className="flex justify-between items-center sticky py-2 px-4   w-40 rounded-full bottom-20 left-1/2 -translate-x-1/2 z-50 bg-blue-500">
      <IoIosArrowBack />

      <p>
        {currentDocumentPage} / {totalDocumentPages}
      </p>
      <IoIosArrowForward />
    </div>
  );
};

export default DocumentNavigation;
