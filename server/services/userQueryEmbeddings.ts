
import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

dotenv.config()

const ai = new GoogleGenAI({apiKey: process.env.Google_API_KEy})

export const createUserQueryEmbeddings = async (query: string): Promise<number[]> => {

    if (typeof query !== "string" || !query.trim()) throw new Error("User query is in an incorrect format")

        const queryEmbedding = await ai.models.embedContent({
            model: "gemini-embedding-2",
            contents: query,
            config: {
                taskType: "RETRIEVAL_QUERY",
                outputDimensionality: 1536
            }
        })

const embeddings = queryEmbedding.embeddings?.[0]?.values

if (embeddings.length !== 1536) throw new Error("there was an error embedding user query")

return embeddings

}


