"use client";
import Loading from "@/components/Loading";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import CertificateVerification from "../../../src/artifacts/contracts/CertificateVerification.sol/CertificateVerification.json";

import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { ethers } from "ethers";

function Verify({ params }: { params: { id: string } }) {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [certImg, setCertImg] = useState("");
    const contractAddress = "0x76a737Dd55906b8D679C6826a873Bf9FCc8e0aB2";
    const router = useRouter()

    useEffect(() => {
        console.log(params.id);
      async function verifyCert() {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(
            window?.ethereum
        );
        
        const signer = provider?.getSigner();
        const contract = new ethers.Contract(
            contractAddress,
            CertificateVerification.abi,
            signer
        );

        try {            
            const response = await contract.getCertificate(params.id);
            console.log(response);
            console.log("response:", response);
            setCertImg(response.imgHash);
            setLoading(false);
            setVerified(true);
            console.log("verified");
        } catch (error) {
            setLoading(false);
            setVerified(false);
        }
      }
      verifyCert();
    }, [])
    

    return (

        <div className='w-full min-h-screen bg-white text-black'>
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
                        <img src={certImg} width={500} height={500}/>

                        </div>
                    </div> : <div> <div className="text-[30px] md:text-[60px] text-black text-center">Fuck you bruh its fake</div></div>}
            </div>}
        </div>
    )
}

export default Verify