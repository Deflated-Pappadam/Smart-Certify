"use client"

import { Button } from "@/components/ui/button"
import { MetaMaskContext } from "@/context/MetaMaskContext"
import { Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"

export default function Page() {
    const router = useRouter();
    const metaMaskContext = useContext(MetaMaskContext);
    if (!metaMaskContext) return null;
    const {account, connectWallet, error} = metaMaskContext;
    useEffect(() => {
        if (account) {
            router.push('/organization/dash');
        }
    }, [account]);

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
                    <Button onClick={connectWallet} className="w-[300px] bg-[#4285F4] text-white" variant="outline">
                        <div className="flex gap-x-2 items-center justify-center" >
                            < Wallet/>
                            Connect Wallet
                        </div>
                    </Button>
                    {error && <p className="text-red-600">{error}</p>}
                </div>
            </div>
        </div>
    )
}