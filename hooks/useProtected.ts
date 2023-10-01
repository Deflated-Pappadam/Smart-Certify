import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
export function useProtected() {
    const { disconnect } = useDisconnect();
    const { address } = useAccount()
    const session = useSession();
    const prevAddress = session.data;

    const handleSignout = async () => {
        console.log(prevAddress);
        console.log(address);
        
        await signOut({ callbackUrl: '/' })
        disconnect()
    }

    useEffect(() => {
        if (prevAddress && !address) {
            handleSignout()
        }
        if (session.status !== 'loading' && !address && prevAddress) {
            handleSignout()
        }
    }, [address, session])
}
