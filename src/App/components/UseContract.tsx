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
  const [createProposalResult, setCreateProposalResult] = React.useState<string | false>(false);
  const [voteProposalResult, setVoteProposalResult] = React.useState<string | false>(false);
  const [changeVoteResult, setChangeVoteResult] = React.useState<string | false>(false);

  const [formData, setFormData] = React.useState({
    description: "",
    fundAddress: "",
    owner: userAddress,
    title: "",
    proposalId: "",
    sentVote: "",
  });

  const { description, fundAddress, owner, title, proposalId, sentVote } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await QFInstance.createProposal(description, fundAddress, owner, title);
      if (response && response.transactionHash) {
        setCreateProposalResult(response.transactionHash);
        queryAllProposals();
      } else {
        setError("Transaction hash not received");
      }
    } catch (error: any) {
      setError(getErrorFromStackTrace(error));
    }
  };

  const queryAllProposals = React.useCallback(async () => {
    try {
      const allProposals = await QFInstance.queryAllProposals();
      setAllProposals(allProposals);
    } catch (error: any) {
      setError(getErrorFromStackTrace(error));
    }
  }, [QFInstance, setError]);

  const voteProposal = async () => {
    try {
      const res = await QFInstance.voteProposal(proposalId, sentVote);
      if (res && res.transactionHash) {
        // Refresh all proposals after voting
        setVoteProposalResult(res.transactionHash);
        queryAllProposals();
      }
    } catch (error: any) {
      setError(getErrorFromStackTrace(error));
    }
  };

  const changeVote = async () => {
    try {
      const res = await QFInstance.changeVote(proposalId, sentVote);
      if (res && res.transactionHash) {
        // Refresh all proposals after changing vote
        setChangeVoteResult(res.transactionHash);
        queryAllProposals();
      }
    } catch (error: any) {
      setError(getErrorFromStackTrace(error));
    }
  };

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
        <div className="p-6 border-t border-purple-700 flex-grow">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="description">Description:</label>
              <input type="text" id="description" name="description" value={description} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="fundAddress">Fund Address:</label>
              <input type="text" id="fundAddress" name="fundAddress" value={fundAddress} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="title">Title:</label>
              <input type="text" id="title" name="title" value={title} onChange={handleChange} />
            </div>
            <button type="submit" className="bg-green-500 text-white font-medium text-sm mt-3 py-1 px-5 rounded">
              Create Proposal
            </button>
          </form>
          {createProposalResult && (
            <div>
              <p>Received pong with hash:</p>
              <p className="break-words text-white text-sm">{createProposalResult}</p>
            </div>
          )}
          {(voteProposalResult || changeVoteResult) && (
            <div>
              <p>Received pong with hash:</p>
              <p className="break-words text-white text-sm">{voteProposalResult || changeVoteResult}</p>
            </div>
          )}
          <div className="p-6 border-t border-purple-700 flex-grow">
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="proposalId">Proposal ID:</label>
                <input type="text" id="proposalId" name="proposalId" value={proposalId} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="sentVote">Vote:</label>
                <input type="text" id="sentVote" name="sentVote" value={sentVote} onChange={handleChange} />
              </div>
              <button onClick={voteProposal} className="text-blue-500">
                Vote
              </button>
              <button onClick={changeVote} className="text-yellow-500">
                Change Vote
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
