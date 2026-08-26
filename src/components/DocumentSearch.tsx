import { useState, useEffect } from "react";

import type { DocumentSearchItem } from "../pages/HomePage";
import { useRouteLoaderData } from "react-router";
import { toast } from "sonner";
import type {
  SimilarChunks,
  RagAnswerShape,
} from "../../server/src/types/chunks";
import RagAnswer from "./RagAnswer";
import { RiSendInsFill } from "react-icons/ri";
import { OrbitProgress } from "react-loading-indicators";

interface Props {
  documentId: string | null;
  documentName: string | null;
  onSelectCitation: (chunkId: string) => void;
}

// interface Props {
//   selectedDocument: DocumentSearchItem;
// }

//TODO: when using this components we need to pass the docID as url params for the page

const DocumentSearch = ({
  documentName,
  documentId,
  onSelectCitation,
}: Props) => {
  const sessionData = useRouteLoaderData("protected");
  const [userQuery, setUserQuery] = useState("");
  const [ragResponse, setRagResponse] = useState<RagAnswerShape | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInput = (userInput: string): void => {
    setUserQuery(userInput);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/documents/${documentId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userQuery }),
      }
    );

    if (!response.ok) {
      toast.error("There was an error querying your document");
      return;
    }
    const result = await response.json();
    setIsLoading(false);

    setRagResponse(result);
    //swap this out with a loading indicator
    toast.success("Query Completed");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-scroll">
        {ragResponse ? (
          <RagAnswer
            ragResponse={ragResponse}
            onSelectCitation={onSelectCitation}
          />
        ) : (
          <p>
            {isLoading ? (
              <OrbitProgress
                color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
              />
            ) : (
              "Your answer will appear here"
            )}
          </p>
        )}
      </div>
      <div className=" flex flex-col">
        <h3 className="font-bold">
          {documentName
            ? `What do you want to know about ${documentName}`
            : "Select a document to get started"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="border rounded-lg flex items-center justify-between mx-8 my-4 p-2">
            <textarea
              className="w-9/10 items-center"
              placeholder="Ask questions about your selected document"
              onChange={(e) => handleUserInput(e.target.value)}
              value={userQuery}
            />
            <button disabled={isLoading} type="submit">
              <RiSendInsFill />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentSearch;
