import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { QuadraticFundingAlgorithm, Expiration, Timestamp, Uint64, InstantiateMsg, ExecuteMsg, Binary, Uint128, QueryMsg, AllProposalsResponse, Proposal } from "./QF.types";


export class QFContract {
  contractAddress: string;
  signingClient: SigningCosmWasmClient;

  constructor(contractAddress: string, signingClient: SigningCosmWasmClient) {
    this.contractAddress = contractAddress;
    this.signingClient = signingClient;
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

  /*
  async executePing(senderAddress: string): Promise<string> {
    const res = await this.signingClient.execute(
      senderAddress,
      this.contractAddress,
      { ping: {} }
    );

    for (const { events } of res.logs) {
      for (const { attributes } of events) {
        const pongAttribute = attributes.find(
          (attribute) => attribute.key === "pong"
        );

        if (pongAttribute?.key === "pong" && pongAttribute?.value === "pong") {
          return res.transactionHash;
        }
      }
    }

    throw new Error("pong event not found in tx result");
  }
  */
}