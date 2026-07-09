import {supabase} from "../config/supabase"

import type {SimilarChunks} from "../src/types/chunks"
export const retrieveChunks = async(queryEmbedding: number[],documentId: string, limit: number ): Promise<SimilarChunks[]>  => {

const {data: similaritySearchData, error: similaritySearchError} = await supabase.rpc("match_chunks", {query_embedding: queryEmbedding, target_document_id: documentId, match_count: limit })

if (similaritySearchError || !similaritySearchData) throw new Error("There was an error running semantic search")

    return similaritySearchData

}