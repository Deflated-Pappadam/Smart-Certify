"use client";
import CertificateVerification from "@/artifacts/contracts/CertificateVerify.sol/CertificateVerification.json";
import Loading from "@/components/Loading";
import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
function Verify({ params }: { params: { id: string } }) {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [certImg, setCertImg] = useState("");
    const [provider, setProvider] = useState<ethers.Provider | null>(null);
    const [wallet, setWallet] = useState<string>("");

    const contractAddress = "0xEFB8357E5A292c195a20119C784EaeF0e2d6Afe8";

    useEffect(() => {        
        async function verifyCert() {
            if (!provider) setProvider(new ethers.JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`));
            setLoading(true);
            if (!provider) return;            
            
            const contract = new ethers.Contract(
                contractAddress,
                CertificateVerification.abi,
                provider
            );

            try {
                const response = await contract.getCertificate(params.id);
                console.log("response:", response);
                setCertImg(response.imgHash);
                setLoading(false);
                setVerified(true);
                console.log("verified");
            } catch (error) {
                console.log(error);
                setLoading(false);
                setVerified(false);
            }
        }
        verifyCert()
    }, [provider])

    return (

        <div className='flex items-center justify-center w-full min-h-screen bg-white text-black'>
            {loading ? <Loading /> : <div>
                {verified ?
                    <div>
                        <div className="flex md:flex-row flex-col w-full h-full p-10 justify-center items-center">
                            <Image
                                src="/verified.gif"
                                width={70}
                                height={70}
                                alt="Picture of the author"
                                className="p-2"
                            />
                            <div className="text-[30px] md:text-[60px] text-black text-center">Your Certificate is verified</div>

                        </div>
                        <div className="flex w-full justify-center">
                            <Image alt="certificate-preview" src={certImg} width={500} height={500} />
                        </div>
                    </div> : <div className="flex w-full h-full justify-center items-center  ">
        <div className="md:text-[90px] text-[30px] text-center text-black"> Sorry, Your certificate is invalid!!</div></div>}
            </div>}
        </div>
    )
}

export default Verify