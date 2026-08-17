
export type SimilarChunks = {
    chunk_id: string,
    document_id: string,
    chunk: string
    chunk_order: number,
}


export type RagAnswerShape = {
    answer: string,
    supportingChunks: SimilarChunks []
}