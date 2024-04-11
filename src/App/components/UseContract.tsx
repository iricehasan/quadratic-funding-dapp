import * as React from "react";
import { getErrorFromStackTrace } from "../../utils/errors";
import { QFContract } from "../../utils/QF";
import { AllProposalsResponse } from "../../utils/QF.types";
import classNames from 'classnames';

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
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-gray-700 m-4">
      <div className="p-6 flex-grow">
      <div className="text-white font-medium text-xl mb-2">All Proposals</div>
        {allProposals && allProposals["proposals"] ? (
          <ul>
            {allProposals["proposals"].map((proposal: any) => (
              <li key={proposal.id} className="border-b border-gray-400 py-4">
                <p className="text-white">ID: {proposal.id}</p>
                <p className="text-white">Title: {proposal.title}</p>
                <p className="text-white">Owner: {proposal.owner}</p>
                <p className="text-white">Description: {proposal.description}</p>
                <p className="text-white">Fund Address: {proposal.fund_address}</p>
                <p className="text-white">Collected Votes: {proposal.collected_votes}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">Loading...</p>
        )}
        <button
          className="bg-indigo-500 text-white font-medium text-sm mt-3 py-1 px-5 rounded"
          onClick={queryAllProposals}
        >
          Refresh All Proposals
        </button>
      </div>
      <div className="p-6 border-t border-purple-700 flex-grow">
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="input-field">
            <label htmlFor="description" className="text-white">Description:</label>
            <input type="text" id="description" name="description" value={description} onChange={handleChange} className="bg-gray-800 border border-gray-600 text-white rounded p-2 w-full" />
          </div>
          <div className="input-field">
            <label htmlFor="fundAddress" className="text-white">Fund Address:</label>
            <input type="text" id="fundAddress" name="fundAddress" value={fundAddress} onChange={handleChange} className="bg-gray-800 border border-gray-600 text-white rounded p-2 w-full" />
          </div>
          <div className="input-field">
            <label htmlFor="title" className="text-white">Title:</label>
            <input type="text" id="title" name="title" value={title} onChange={handleChange} className="bg-gray-800 border border-gray-600 text-white rounded p-2 w-full" />
          </div>
          <button type="submit" className="bg-green-500 text-white font-medium text-sm mt-3 py-1 px-5 rounded">
            Create Proposal
          </button>
        </form>
        {createProposalResult && (
          <div className="result">
            <p>Received pong with hash:</p>
            <p>{createProposalResult}</p>
          </div>
        )}
      </div>
      <div className="p-6 border-t border-purple-700 flex-grow">
        <form className="mb-4">
          <div className="input-field">
            <label htmlFor="proposalId" className="text-white">Proposal ID:</label>
            <input type="text" id="proposalId" name="proposalId" value={proposalId} onChange={handleChange} className="bg-gray-800 border border-gray-600 text-white rounded p-2 w-full" />
          </div>
          <div className="input-field">
            <label htmlFor="sentVote" className="text-white">Vote:</label>
            <input type="text" id="sentVote" name="sentVote" value={sentVote} onChange={handleChange} className="bg-gray-800 border border-gray-600 text-white rounded p-2 w-full" />
          </div>
          <button type="button" onClick={voteProposal} className="bg-blue-500 text-white font-medium text-sm mt-3 py-1 px-5 rounded">
            Vote
          </button>
          <button type="button" onClick={changeVote} className="bg-yellow-500 text-white font-medium text-sm mt-3 ml-2 py-1 px-5 rounded">
            Change Vote
          </button>
        </form>
        {(voteProposalResult || changeVoteResult) && (
          <div className="result">
            <p>Received pong with hash:</p>
            <p>{voteProposalResult || changeVoteResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}
