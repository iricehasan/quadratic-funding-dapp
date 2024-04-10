export interface NetworkConfig {
    readonly chainId: string;
    readonly rpcUrl: string;
    readonly faucetUrl: string;
    readonly addressPrefix: string;
    readonly feeToken: string;
    readonly CodeId: number;
    readonly contractAddress: string;
  }
  export const config: NetworkConfig = {
    chainId: "pion-1",
    addressPrefix: "neutron",
    rpcUrl: "https://rpc-palvus.pion-1.ntrn.tech",
    faucetUrl: "",
    feeToken: "untrn",
    CodeId: 3335,
    contractAddress: "neutron1kqsfsj6vszv0muxr0w62nwkk2g09m59hnhpu3p07mvsrptk62evque396x",
  };