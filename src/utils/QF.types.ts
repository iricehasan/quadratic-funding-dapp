export type QuadraticFundingAlgorithm = {
    capital_constrained_liberal_radicalism: {
      parameter: string;
    };
  };
  export type Expiration = {
    at_height: number;
  } | {
    at_time: Timestamp;
  } | {
    never: {
      [k: string]: unknown;
    };
  };
  export type Timestamp = Uint64;
  export type Uint64 = string;
  export interface InstantiateMsg {
    admin: string;
    algorithm: QuadraticFundingAlgorithm;
    budget_denom: string;
    leftover_addr: string;
    nft_address: string;
    proposal_period: Expiration;
    voting_period: Expiration;
  }
  export type ExecuteMsg = {
    create_proposal: {
      description: string;
      fund_address: string;
      metadata?: Binary | null;
      owner: string;
      title: string;
    };
  } | {
    vote_proposal: {
      proposal_id: number;
      sent_vote: Uint128;
    };
  } | {
    change_vote: {
      proposal_id: number;
      sent_vote: Uint128;
    };
  } | {
    trigger_distribution: {};
  };
  export type Binary = string;
  export type Uint128 = string;
  export type QueryMsg = {
    proposal_by_i_d: {
      id: number;
    };
  } | {
    all_proposals: {};
  };
  export interface AllProposalsResponse {
    proposals: Proposal[];
  }
  export interface Proposal {
    collected_votes: Uint128;
    description: string;
    fund_address: string;
    id: number;
    metadata?: Binary | null;
    owner: string;
    title: string;
  }