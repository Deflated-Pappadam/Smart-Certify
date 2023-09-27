"use client";
import Loading from "@/components/Loading";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
// import verified from "@pu"
let loading = false;
let verified = true;


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

function Verify() {
    const certDetails = {
        name: "RIYANNA MARIA ABISON",
        event: "SWAYAM",
        type: "WEB DEVELOPMENT",
        qrLink: "https://cdn.discordapp.com/attachments/946819313342500914/1156447200839204935/of_participation.png?ex=651500e2&is=6513af62&hm=dd10af8d521374fe8f5a8e7cf4a13f35dc40ac5df17fecfd6d0be02966d7e334&"
    }

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

                        </div>
                    </div> : <div></div>}
            </div>}
        </div>
    )
}

export default Verify