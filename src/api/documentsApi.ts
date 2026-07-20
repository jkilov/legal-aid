

import type { AllDocuments } from "../../shared/types";


export const getDocumentsLibrary = async(accessToken: string): Promise<AllDocuments[]> => {
    const allDocumentsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/documents/library`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!allDocumentsResponse.ok) {
        const errorBody = await allDocumentsResponse.json().catch(() => ({}));
        throw new Error(errorBody.message || "Failed to load documents");
      }

      const allDocuments = await allDocumentsResponse.json();

      return allDocuments

}




export const getDocumentFile = async (documentId: string, accessToken: string) => {

 

 
  if (!documentId || !accessToken) throw new Error ("incomplete credentials for fetching document")




  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/documents/${documentId}/view`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })

  
    if (!response.ok) throw new Error("unable to retrieve document for viewing")

      const result = await response.blob()

console.log("b", result)

      return result
    
  } catch (error) {

    return error
    
  }


}

