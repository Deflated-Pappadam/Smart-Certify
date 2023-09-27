"use client";
import Loading from "@/components/Loading";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
// import verified from "@pu"
let loading = false;
let verified = true;


function Verify() {


    return (

        <div className='w-full min-h-screen bg-white text-black'>
            {loading ? <Loading /> : <div>
                {verified ? <div className="flex w-full h-full p-10 justify-center items-center">
                    <Image
                        src="/verified.gif"
                        width={70}
                        height={70}
                        alt="Picture of the author"
                        className="p-2"
                    />
                    <div className="text-[60px] text-black text-center">Your Certificate is verified</div>
                    <div></div>
                </div> : <div></div>}
            </div>}
        </div>
    )
}

export default Verify