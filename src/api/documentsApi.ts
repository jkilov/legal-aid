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