import { useState } from "react";

import type { DocumentSearchItem } from "../pages/HomePage";
import { useRouteLoaderData } from "react-router";
import { toast } from "sonner";

interface Props {
  selectedDocument: DocumentSearchItem;
}

//TODO: when using this components we need to pass the docID as url params for the page

const DocumentSearch = ({ selectedDocument }: Props) => {
  const sessionData = useRouteLoaderData("protected");
  const [userQuery, setUserQuery] = useState("");

  const handleUserInput = (userInput: string): void => {
    setUserQuery(userInput);
  };

  //HACK:
  const document_id = "d278c33d-a200-4fe7-a3d3-83f7de41c55a";
  const document_name = "fake_contract_chunking_test.pdf";
  //HACK: - use actual passed props later

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/documents/${document_id}/query`,
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
    toast.success("Query Completed");
  };

  return (
    <div>
      <h3>What do you want to know about {document_name}</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Ask questions about your selected document"
          onChange={(e) => handleUserInput(e.target.value)}
          value={userQuery}
        />
        <button type="submit">Ask</button>
      </form>
    </div>
  );
};

export default DocumentSearch;
