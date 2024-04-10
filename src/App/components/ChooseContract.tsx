import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import * as React from "react";
import { config } from "../../config/network";
import { getErrorFromStackTrace } from "../../utils/errors";
import { QFContract } from "../../utils/QF";

interface ChooseContractProps {
  readonly userAddress: string;
  readonly signingClient: SigningCosmWasmClient;
  readonly setQFInstance: React.Dispatch<
    React.SetStateAction<QFContract | undefined>
  >;
  readonly setError: React.Dispatch<React.SetStateAction<string>>;
}

export default function ChooseContract({
  userAddress,
  signingClient,
  setQFInstance,
  setError,
}: ChooseContractProps): JSX.Element {

  const contractAddress = config.contractAddress

  return (
    <div>
      <div className="w-96 rounded-lg overflow-hidden shadow-lg bg-gray-700 border border-purple-700 m-4 flex flex-col">
        <div className="p-6 flex-grow">
          <button
            className="bg-indigo-500 text-white font-medium text-sm mt-3 py-1 px-5 rounded"
            onClick={() =>
              setQFInstance(
                new QFContract(contractAddress, signingClient, userAddress)
              )
            }
          >
            Use contract address
          </button>
        </div>
      </div>
    </div>
  );
}