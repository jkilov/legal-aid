import { useEffect, useState } from "react";

import type { AllDocuments } from "../../shared/types";
import { useRouteLoaderData } from "react-router";
import { shortenName } from "../helper/shortenName";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface Props {
  onDocumentSelection: (document: AllDocuments) => void;
}

const Documents = ({ onDocumentSelection }: Props) => {
  const [documents, setDocuments] = useState<AllDocuments[]>([]);
  const [selectedDocument, SetSelectedDocument] = useState<AllDocuments>(
    {} as AllDocuments
  );
  const [descriptionSelected, setDescriptionSelected] = useState(false);

  const session = useRouteLoaderData("protected");

  const handleSelectDocument = (document: AllDocuments) => {
    SetSelectedDocument(document);
    onDocumentSelection(document);
  };

  const handleDescriptionSelected = (boolean: boolean) => {
    setDescriptionSelected(boolean);
  };

  console.log(descriptionSelected);
  useEffect(() => {
    const retrieveAllDocuments = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/documents/library`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${session.access_token}`,
          },
        }
      );
      if (!response.ok) return "There was an error";
      const result = await response.json();
      setDocuments(result);
    };

    retrieveAllDocuments();
  }, [session.access_token]);

  if (documents.length === 0) return "No documents uploaded";

  return (
    <div>
      {documents.map((document) => (
        <div
          key={document.document_id}
          className={`text-left p-3 border-b hover:bg-violet-600 cursor-pointer ${
            selectedDocument.document_id === document.document_id
              ? "bg-pink-500"
              : ""
          }`}
          onClick={() => handleSelectDocument(document)}
        >
          <div className="flex-col">
            <p>{shortenName(document.document_name)}</p>
            <p className="text-xs">Uploaded {document.created_at}</p>
            <div className="flex justify-between">
              <p className="text-xs">{document.status}</p>
              <div className="relative ">
                <IoMdInformationCircleOutline
                  onMouseEnter={() => handleDescriptionSelected(true)}
                  onMouseLeave={() => handleDescriptionSelected(false)}
                />
                {descriptionSelected && (
                  <p className="absolute left-3 top-3 rounded-lg p-3 text-xs bg-amber-50 shadow-xl text-black w-2xs z-100 ">
                    {document.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Documents;
