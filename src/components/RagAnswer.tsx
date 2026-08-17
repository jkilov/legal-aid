import type { RagAnswerShape } from "../../server/src/types/chunks";

interface Props {
  ragResponse: RagAnswerShape;
}

const RagAnswer = ({ ragResponse }: Props) => {
  return (
    <div>
      <div>
        {ragResponse && (
          <div>
            <h2>Response:</h2> <p>{ragResponse.answer}</p>
            <h3>Supporting Citations:</h3>
            {ragResponse.supportingChunks.map((citation) => (
              <div>
                <p>{citation.chunk_order}</p>
                <p>{citation.chunk}</p>
                <p>{citation.chunk_id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RagAnswer;
