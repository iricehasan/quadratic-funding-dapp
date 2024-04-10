import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { QuadraticFundingAlgorithm, Expiration, Timestamp, Uint64, InstantiateMsg, ExecuteMsg, Binary, Uint128, QueryMsg, AllProposalsResponse, Proposal } from "./QF.types";
import { ToastError, ToastSuccess } from "../App/components/alert/SweetAlert";

export class QFContract {
  contractAddress: string;
  signingClient: SigningCosmWasmClient;
  senderAddress: string;

  constructor(contractAddress: string, signingClient: SigningCosmWasmClient, senderAddress: string) {
    this.contractAddress = contractAddress;
    this.signingClient = signingClient;
    this.senderAddress = senderAddress;
  }

  /*
  static async instantiate(
    senderAddress: string,
    signingClient: SigningCosmWasmClient,
    codeId: number
  ): Promise<string> {
    const { contractAddress } = await signingClient.instantiate(
      senderAddress,
      codeId,
      {},
      Math.random().toString(20).substr(2, 6) // random string
    );

    return contractAddress;
  }
  */

  async queryAllProposals(): Promise<AllProposalsResponse> {
    const allProposals = await this.signingClient.queryContractSmart(
      this.contractAddress,
      { all_proposals: {} }
    );

    return allProposals;
  }

  
  async createProposal(description: string, fundAddress: string, owner: string, title: string) {
    try {
      const res = await this.signingClient.execute(
        this.senderAddress,
        this.contractAddress,
        { create_proposal: { description, fund_address: fundAddress, owner: this.senderAddress, title } },
        "auto",
        "",
        []
      );

      ToastSuccess({
        tHashLink: res?.transactionHash,
      }).fire({ title: "Transfer successful" });

      return res ? { transactionHash: res?.transactionHash } : false;
    } catch (error) {
      console.error("Error transferring token:", error);
      ToastError.fire({ title: "Transfer failed" });
      return false;
    }
  }

  async voteProposal(proposalId: string, sentVote: string) {
    try {
      const res = await this.signingClient.execute(
        this.senderAddress,
        this.contractAddress,
        { send_vote: { proposal_id: proposalId, sent_vote: sentVote} },
        "auto",
        "",
        []
      );

      ToastSuccess({
        tHashLink: res?.transactionHash,
      }).fire({ title: "Transfer successful" });

      return res ? { transactionHash: res?.transactionHash } : false;
    } catch (error) {
      console.error("Error transferring token:", error);
      ToastError.fire({ title: "Transfer failed" });
      return false;
    }
  }

  async changeVote(proposalId: string, sentVote: string) {
    try {
      const res = await this.signingClient.execute(
        this.senderAddress,
        this.contractAddress,
        { send_vote: { proposal_id: proposalId, sent_vote: sentVote} },
        "auto",
        "",
        []
      );

      ToastSuccess({
        tHashLink: res?.transactionHash,
      }).fire({ title: "Transfer successful" });

      return res ? { transactionHash: res?.transactionHash } : false;
    } catch (error) {
      console.error("Error transferring token:", error);
      ToastError.fire({ title: "Transfer failed" });
      return false;
    }
  }
}