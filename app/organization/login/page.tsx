"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Wallet } from "lucide-react"
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { polygonMumbai } from "viem/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export default function Page() {
  const { connectAsync, connectors, error: connectError, isLoading, pendingConnector } = useConnect({
    connector: new MetaMaskConnector({
      chains: [polygonMumbai]
    }),
  })
  const [error, setError] = useState("");
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (connectError) setError(connectError.message);
  }, [connectError]);

  const handleLogin = async () => {
    try {
      const callbackUrl = '/organization/dash'
      if (address) {
        signIn('credentials', { type: "web3", address: address, callbackUrl })
        return
      }
      connectAsync().then((data) => {
        signIn('credentials', { type: "web3", address: data?.account, callbackUrl })
      }).catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" >
      <div className="max-w-sm rounded-lg shadow-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-2 text-center" >
          <h1 className="text-3xl font-bold" >Connect Your Wallet</h1>
          <p className="text-zinc-500 dark:text-zinc-400" >
            By logging in, you accept our
          </p>
        </div>
        <div className="space-y-4" >
          <hr className="flex-grow border-zinc-200 dark:border-zinc-700" />
          <Button onClick={handleLogin} disabled={isLoading && connectors[1].id === pendingConnector?.id} className="w-[300px] bg-[#4285F4] text-white" variant="outline">
            <div className="flex gap-x-2 items-center justify-center" >
              {isLoading && connectors[1].id === pendingConnector?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting
                </>
              ):
              (<>
                  < Wallet />
                  Connect Wallet
                </>)
              }
            </div>
          </Button>
          {connectError && <p className="text-red-600">{connectError.name}</p>}
        </div>
      </div>
    </div>
  )
}