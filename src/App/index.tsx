import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import * as React from "react";
import { config } from "../config/network";
import { createSigningClient } from "../utils/client";
import { getErrorFromStackTrace } from "../utils/errors";
import { QFContract } from "../utils/QF";
import { loadOrCreateWallet } from "../utils/wallet";
//import AppBrand from "./components/AppBrand";
import ChooseContract from "./components/ChooseContract";
import ErrorBanner from "./components/ErrorBanner";
import UseContract from "./components/UseContract";
import UserAccount from "./components/UserAccount";

export default function App(): JSX.Element {
  const [userAddress, setUserAddress] = React.useState("");
  const [signingClient, setSigningClient] =
    React.useState<SigningCosmWasmClient>();
  const [QFInstance, setQFInstance] =
    React.useState<QFContract>();
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    (async function updateAddressAndClient() {
      try {
        const wallet = await loadOrCreateWallet(config);

        const userAddress = (await wallet.getAccounts())[0].address;
        setUserAddress(userAddress);

        const signingClient = await createSigningClient(config, wallet);
        setSigningClient(signingClient);
      } catch (error: any) {
        setError(getErrorFromStackTrace(error));
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-gray-600 grid grid-cols-1 md:grid-cols-2 content-center justify-items-center gap-5">
      {userAddress && signingClient && QFInstance && (
        <div className="md:w-full">
          <UseContract 
            userAddress={userAddress}
            QFInstance={QFInstance}
            setError={setError}
          />
        </div>
      )}
      <div className="md:flex md:flex-col md:items-start md:w-full">
        {userAddress && signingClient && (
          <div className="md:w-full">
            <ChooseContract
              userAddress={userAddress}
              signingClient={signingClient}
              setQFInstance={setQFInstance}
              setError={setError}
            />
          </div>
        )}
        {userAddress && signingClient && (
          <div className="md:w-full">
            <UserAccount
              userAddress={userAddress}
              signingClient={signingClient}
              setError={setError}
            />
          </div>
        )}
      </div>
      {error && (
        <div>
          <ErrorBanner error={error} clearError={() => setError("")} />
        </div>
      )}
    </main>
  );
  
      }  