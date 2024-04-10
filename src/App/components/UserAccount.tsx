import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import * as React from "react";
import { config } from "../../config/network";
import { getErrorFromStackTrace } from "../../utils/errors";

interface UserAccountProps {
  readonly userAddress: string;
  readonly signingClient: SigningCosmWasmClient;
  readonly setError: React.Dispatch<React.SetStateAction<string>>;
}

export default function UserAccount({
  userAddress,
  signingClient,
  setError,
}: UserAccountProps): JSX.Element {
  const [balance, setBalance] = React.useState("0");

  const updateBalance = React.useCallback(async () => {
    try {
      const { amount: balance } = await signingClient.getBalance(
        userAddress,
        config.feeToken
      );
      setBalance(balance);
    } catch (error: any) {
      setError(getErrorFromStackTrace(error));
    }
  }, [setError, signingClient, userAddress]);

  React.useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return (
    <div>
      <div className="w-96 rounded-lg overflow-hidden shadow-lg bg-gray-700 border border-purple-700 m-4 flex flex-col">
        <div className="p-6 flex-grow">
          <div className="text-white font-medium text-xl mb-2">My address</div>
          <p className="break-words text-white text-sm">{userAddress}</p>
        </div>
        <div className="p-6 border-t border-purple-700 flex-grow">
          <div className="text-white font-medium text-xl mb-2">
            My balance ({config.feeToken})
          </div>
          <p className="text-white text-l">{balance}</p>
          <button
            className="bg-indigo-500 text-white font-medium text-sm py-1 px-5 rounded"
            onClick={() => updateBalance()}
          >
            Refresh balance
          </button>
        </div>
      </div>
    </div>
  );
}