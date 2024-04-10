import * as React from "react";
import { getErrorFromStackTrace } from "../../utils/errors";
import { QFContract } from "../../utils/QF";
import { AllProposalsResponse } from "../../utils/QF.types";

interface UseContractProps {
  readonly userAddress: string;
  readonly QFInstance: QFContract;
  readonly setError: React.Dispatch<React.SetStateAction<string>>;
}

export default function UseContract({
  userAddress,
  QFInstance,
  setError,
}: UseContractProps): JSX.Element {
  const [allProposals, setAllProposals] = React.useState<AllProposalsResponse>();
  const [allProposalsResult, setAllProposalsResult] = React.useState("");


  const queryAllProposals = React.useCallback(async () => {
    try {
      const allProposals = await QFInstance.queryAllProposals();
      setAllProposals(allProposals);
    } catch (error: any) {
      setError(getErrorFromStackTrace(error));
    }
  }, [QFInstance, setError]);

  /*
  const executePing = React.useCallback(async () => {
    setPingResult("");

    try {
      const transactionHash = await pingPongInstance.executePing(userAddress);
      setPingResult(transactionHash);
    } catch (error) {
      setError(getErrorFromStackTrace(error));
    }
  }, [pingPongInstance, setError, userAddress]);
  */

  React.useEffect(() => {
    queryAllProposals();
  }, [queryAllProposals]);

  return (
    <div>
   <div className="w-96 rounded-lg overflow-hidden shadow-lg bg-gray-700 border border-purple-700 m-4 flex flex-col">
        <div className="p-6 flex-grow">
          <div className="text-white font-medium text-xl mb-2">All Proposals</div>
          {allProposals ? (
            <ul>
              {Object.entries(allProposals).map(([proposalId, proposal]) => (
                <li key={proposalId}>
                  {/* Render each proposal here using proposalId and proposal */}
                  <p>{proposalId}</p>
                  <p>{JSON.stringify(proposal)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )}
          <button
            className="bg-indigo-500 text-white font-medium text-sm mt-3 py-1 px-5 rounded"
            onClick={() => queryAllProposals()}
          >
            Refresh All Proposals
          </button>
        </div>
        {allProposalsResult ? (
          <div className="p-6 border-t border-purple-700 flex-grow">
            <div className="text-white font-medium text-xl mb-2">
              Received pong with hash:
            </div>
            <p className="break-words text-white text-sm">{allProposalsResult}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}