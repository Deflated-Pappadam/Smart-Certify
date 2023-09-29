import React, { ChangeEvent, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ethers } from 'ethers';
import pixelmatch from 'pixelmatch';
import jsQR from "jsqr";
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
import CertificateVerification from "@/artifacts/contracts/CertificateVerify.sol/CertificateVerification.json";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const contractAddress = "0xEFB8357E5A292c195a20119C784EaeF0e2d6Afe8";

function PdfMetadataReader() {
    const [metadata, setMetadata] = useState<any>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [certImg, setCertImg] = useState("");
    const [provider, setProvider] = useState<ethers.Provider | null>(null);
    const [wallet, setWallet] = useState<string>("");

    async function verifyCert(blockId: string) {
        let provider = null;
        if (window.ethereum == null) {
            console.log("MetaMask not installed");
            provider = (new ethers.JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`));
        } else {
            if (!provider) {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
                setWallet(accounts[0]);
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
                setCertImg(response.imgHash);
                setLoading(false);
                setVerified(true);
                console.log("verified");
                return response.imgHash as string;
            } catch (error) {
                console.log(error);
                setLoading(false);
                setVerified(false);
            }
        }
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];

        if (!file) {
            return;
        }
        const arrayBuffer = new Uint8Array(await file.arrayBuffer());

        console.log(arrayBuffer);


        // Load the PDF document
        var loadingTask = pdfjsLib.getDocument(arrayBuffer);
        loadingTask.promise.then(async function (doc) {
            const images: any[] = [];
            const page = await doc.getPage(1);
            const operatorList = await page.getOperatorList();
            console.log(operatorList);

            const validObjectTypes = [
                pdfjsLib.OPS.paintImageXObject, // 85
                pdfjsLib.OPS.paintImageXObjectRepeat, // 88
                82 //82
            ];
            for (let idx = 0; idx < operatorList.fnArray.length; idx++) {
                const element = operatorList.fnArray[idx];
                if (validObjectTypes.includes(element)) {
                    const metadata = await doc.getMetadata();
                    console.log(JSON.stringify(metadata.info, null, 2));
                    let blockImgSrc: string | undefined = undefined;
                    
                    const blockId = metadata.metadata?.get("blockcertificateid:blockcertificateid");
                    if (blockId) {
                        blockImgSrc = await verifyCert(blockId);
                    }
                    const imageName = operatorList.argsArray[idx][0];
                    page.objs.get(imageName, async (image: { bitmap: ImageBitmap, data: any; width: number; height: number; }) => {

                        const imageWidth = image.width;
                        const imageHeight = image.height;

                        const canvas: HTMLCanvasElement | null = document.createElement("canvas");
                        canvas.width = imageWidth;
                        canvas.height = imageHeight;
                        const ctx = canvas.getContext('2d')!;
                        ctx.drawImage(image.bitmap, 0, 0);

                        if (!blockId) {
                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const decodedData = jsQR(imageData.data, imageWidth, imageHeight);
                            console.log(decodedData?.data);
                            const pattern = /\/verify\/([^/]+)$/;
                            let url = decodedData?.data;
                            if (url) {
                                const match = pattern.exec(url);
                                if (match) {
                                    const id = match[1];
                                    blockImgSrc = await verifyCert(id);
                                } else {
                                    console.log("NOT VERIFIED");
                                    return;
                                }
                            }
                        }
                        if (!blockImgSrc) return
                        const blockImg = new Image();
                        blockImg.crossOrigin = "Anonymous";
                        blockImg.setAttribute('crossOrigin', '')
                        blockImg.src = blockImgSrc;
                        const canvasBlock = document.createElement("canvas");
                        blockImg.onload = function() {
                            console.log(imageHeight);
                            console.log(imageWidth);
                            console.log(blockImg.height);
                            console.log(blockImg.width);
                            canvasBlock.width = imageWidth;
                            canvasBlock.height = imageHeight;
                            
                            const ctxBlock = canvasBlock.getContext("2d")!;
                            ctxBlock.drawImage(blockImg, 0, 0, imageWidth, imageHeight);

                            console.log(canvasBlock.toDataURL());
                            console.log(canvas.toDataURL());
                            
                            const canvasDiff = canvasRef.current!;
                            canvasDiff.width = imageWidth;
                            canvasDiff.height = imageHeight;
                            const diffCtx = canvasDiff.getContext("2d")!;
                            const diff = diffCtx.createImageData(imageWidth, imageHeight);
                            const mismatchedPixels = pixelmatch(
                                ctx.getImageData(0, 0, imageWidth, imageHeight).data,
                                ctxBlock.getImageData(0, 0, imageWidth, imageHeight).data,
                                diff.data,
                                imageWidth,
                                imageHeight,
                                { threshold: 0.1 }
                            );
                            diffCtx.putImageData(diff, 0, 0);
                            console.log(mismatchedPixels);
                        }




                        // console.log('image', image);

                        // imageUnit8Array contains only RGB need add alphaChanel
                        // const imageUint8ArrayWithAlphaChanel = addAlphaChannelToUnit8ClampedArray(imageUnit8Array, imageWidth, imageHeight);

                        // const imageData = new ImageData(imageUint8ArrayWithAlphaChanel, imageWidth, imageHeight);
                        // console.log(imageData);
                    })
                }
            }
            console.log(images)
        });
    };

    return (
        <div>
            <h1>PDF Metadata Reader</h1>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <canvas id="canvas" ref={canvasRef}></canvas>
            {metadata && (
                <div>
                    <h2>PDF Metadata:</h2>
                    <ul>
                        <li><strong>Title:</strong> {metadata.Title}</li>
                        <li><strong>Author:</strong> {metadata.Author}</li>
                        <li><strong>Subject:</strong> {metadata.Subject}</li>
                        <li><strong>Keywords:</strong> {metadata.Keywords}</li>
                        <li><strong>Creator:</strong> {metadata.Creator}</li>
                        <li><strong>Producer:</strong> {metadata.Producer}</li>
                        <li><strong>Creation Date:</strong> {metadata.CreationDate}</li>
                        <li><strong>Modification Date:</strong> {metadata.ModDate}</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default PdfMetadataReader;