import type { RagAnswerShape } from "../../server/src/types/chunks";

interface Props {
  ragResponse: RagAnswerShape;
  onSelectCitation: (chunkId: string) => void;
}

const RagAnswer = ({ ragResponse, onSelectCitation }: Props) => {
  return (
    <div>
      <div>
        {ragResponse && (
          <div>
            <div>
              <h2>Response:</h2> <p>{ragResponse.answer}</p>
              <h3>Supporting Citations:</h3>
            </div>
            <div>
              {ragResponse.supportingChunks.map((citation, index) => (
                <p
                  key={citation.chunk_id}
                  className="italic"
                  onClick={() => onSelectCitation(citation.chunk)}
                >
                  See citation {index + 1}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RagAnswer;
