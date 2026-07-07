import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

dotenv.config()
const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY})

export const chunkEmbedding = async(chunkText: string): Promise<number[]> => { 

    if (typeof chunkText !== "string" || !chunkText.trim() ) throw new Error("unable to find text for embedding")

    const embeddingResponse = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: chunkText,
        config: {
            taskType: "RETRIEVAL_DOCUMENT",
            outputDimensionality: 1536,
        }
    })


const embedding = embeddingResponse.embeddings?.[0]?.values

if (!embedding || embedding.length !== 1536) throw new Error("There was an error embedding document chunk")

return embedding
}


