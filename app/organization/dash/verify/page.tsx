"use client"

import CertificateVerification from "@/artifacts/contracts/CertificateVerify.sol/CertificateVerification.json"
import BackButton from "@/components/BackButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useProtected } from "@/hooks/useProtected"
import { cn } from "@/lib/utils"
import { ethers } from "ethers"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as pdfjsLib from 'pdfjs-dist'
import Pixelmatch from "pixelmatch"
import { useRef, useState } from "react"
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');

export default function Page() {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    const contractAddress = "0xEFB8357E5A292c195a20119C784EaeF0e2d6Afe8";
    useProtected()
    const { toast } = useToast()

    async function verifyCert(blockId: string) {
        let provider = null;
        if (window.ethereum == null) {
            console.log("MetaMask not installed");
            provider = (new ethers.JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`));
        } else {
            if (!provider) {
                provider = new ethers.BrowserProvider(window.ethereum);
            }
            setLoading(true);
            if (!provider) return;
            const contract = new ethers.Contract(
                contractAddress,
                CertificateVerification.abi,
                provider
            );
            try {
                const response = await contract.getCertificate(blockId);
                console.log("response:", response);
                setLoading(false);
                return response.imgHash as string;
            } catch (error) {
                console.log(error);
                setLoading(false);
                setVerified(false);
            }
        }
    }

    const verifyCertificate = async () => {
        setLoading(true);
        const file = fileInputRef.current!.files![0];

        if (!file) {
            return;
        }
        const arrayBuffer = new Uint8Array(await file.arrayBuffer());
        var loadingTask = pdfjsLib.getDocument(arrayBuffer);
        loadingTask.promise.then(async function (doc) {
            const page = await doc.getPage(1);
            const operatorList = await page.getOperatorList();
            const validObjectTypes = [
                pdfjsLib.OPS.paintImageXObject, // 85
                pdfjsLib.OPS.paintImageXObjectRepeat, // 88
                82 //JPEG Image
            ];
            for (let idx = 0; idx < operatorList.fnArray.length; idx++) {
                const element = operatorList.fnArray[idx];
                if (validObjectTypes.includes(element)) {
                    const metadata = await doc.getMetadata();
                    console.log(JSON.stringify(metadata?.metadata?.getAll(), null, 2));
                    let blockImgSrc: string | undefined = undefined;

                    const blockId = metadata.metadata?.get("blk:blockcertificateid");
                    console.log("Found Block ID: "+blockId);
                    
                    if (!blockId) {
                        toast({
                            variant: "destructive",
                            title: "The Document Is Tampered!",
                            description: "this document metadata does not match",
                          })
                        setVerified(false);
                        setLoading(false);
                        return;
                    }
                    blockImgSrc = await verifyCert(blockId);
                    if (!blockImgSrc) return;
                    const imageName = operatorList.argsArray[idx][0];
                    page.objs.get(imageName, async (image: { bitmap: ImageBitmap, data: any; width: number; height: number; }) => {
                        const imageWidth = image.width;
                        const imageHeight = image.height;
                        const canvas: HTMLCanvasElement | null = document.createElement("canvas");
                        canvas.width = imageWidth;
                        canvas.height = imageHeight;
                        const ctx = canvas.getContext('2d')!;
                        ctx.drawImage(image.bitmap, 0, 0);
                        // if (!blockId) {
                        //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        //     const decodedData = jsQR(imageData.data, imageWidth, imageHeight);
                        //     console.log(decodedData?.data);
                        //     const pattern = /\/verify\/([^/]+)$/;
                        //     let url = decodedData?.data;
                        //     if (url) {
                        //         const match = pattern.exec(url);
                        //         if (match) {
                        //             const id = match[1];
                        //             blockImgSrc = await verifyCert(id);
                        //         } else {
                        //             console.log("NOT VERIFIED");
                        //             return;
                        //         }
                        //     }
                        // }
                        if (!blockImgSrc) return;
                        const blockImg = new Image();
                        blockImg.crossOrigin = "Anonymous";
                        blockImg.setAttribute('crossOrigin', '')
                        blockImg.src = blockImgSrc;
                        const canvasBlock = document.createElement("canvas");
                        blockImg.onload = function () {
                            canvasBlock.width = imageWidth;
                            canvasBlock.height = imageHeight;

                            const ctxBlock = canvasBlock.getContext("2d")!;
                            ctxBlock.drawImage(blockImg, 0, 0, imageWidth, imageHeight);

                            const canvasDiff = document.createElement("canvas");;
                            canvasDiff.width = imageWidth;
                            canvasDiff.height = imageHeight;
                            const diffCtx = canvasDiff.getContext("2d")!;
                            const diff = diffCtx.createImageData(imageWidth, imageHeight);
                            const mismatchedPixels = Pixelmatch(
                                ctx.getImageData(0, 0, imageWidth, imageHeight).data,
                                ctxBlock.getImageData(0, 0, imageWidth, imageHeight).data,
                                diff.data,
                                imageWidth,
                                imageHeight,
                                { threshold: 0.1 }
                            );
                            diffCtx.putImageData(diff, 0, 0);
                            if (mismatchedPixels == 0) {
                                setVerified(true);
                                setLoading(false);
                                toast({
                                    variant: "default",
                                    title: "The Document was verified!",
                                    description: "this document is authentic",
                                  })
                                console.log("The document has been verified");
                            }
                            else {
                                setVerified(false);
                                setLoading(false);
                                toast({
                                    variant: "destructive",
                                    title: "The Document Is Tampered!",
                                    description: "this document does not match with the one stored on the blockchain",
                                  })
                            }
                            //cleanup all canvas elements
                            canvas.remove();
                            canvasDiff.remove();
                            canvasBlock.remove();
                        }
                    })
                }
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center" >
            <BackButton url="/organization/dash" disabled={false} />
            <div className="max-w-sm rounded-lg shadow-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700">
                <div className="space-y-2" >
                    <h1 className="text-3xl font-bold" >Upload Certificate</h1>
                    <p className="text-zinc-500 dark:text-zinc-400" >
                        We will ensure the authenticity of the certificate.
                    </p>
                </div>
                <div className="space-y-4" >
                    <hr className="flex-grow border-zinc-200 dark:border-zinc-700" />
                    <div className={`grid w-full max-w-sm items-center gap-1.5`}>
                        <Input ref={fileInputRef} onChange={()=> {setVerified(false)}} id="pdf" type="file" />
                    </div>

                    


                    <Button variant={"secondary"} className={cn(`w-full ${verified && `border-2 bg-transpanent border-green-400 rounded-lg`}`)} disabled={loading || verified} onClick={verifyCertificate}>{ verified? <>Verified</> : <>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /><span>Verifying...</span></> : <span>Verify</span>}</>}</Button>
                </div>
            </div>
        </div>
    )
}