"use client"
import CertificateVerification from "@/artifacts/contracts/CertificateVerify.sol/CertificateVerification.json"
import BackButton from "@/components/BackButton"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useProtected } from "@/hooks/useProtected"
import { cn } from "@/lib/utils"
import { db, storage } from "@/lib/firebase"
import { format } from "date-fns"
import { ethers } from "ethers"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import NextImage from "next/image"
import { useRouter } from "next/navigation"
import { PDFDocument, PDFName } from 'pdf-lib'
import QRCode from 'qrcode'
import { FormEvent, useContext, useEffect, useRef, useState } from "react"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { v4 as uuidv4 } from 'uuid'

let canvasImg ="https://cdn.discordapp.com/attachments/946819313342500914/1157381635214413834/of_participation.png?ex=65186724&is=651715a4&hm=c775ce17a5caff93d620f1cf9a5137775b0e8ce7ce877a1ea79bc0a07c2a6e53&";
    
declare global {
    interface Window {
        ethereum?: any
    }
}
const contractAddress = "0xEFB8357E5A292c195a20119C784EaeF0e2d6Afe8";

export default function Component() {
    const [metaMask, setMetaMask] = useState(true);
    const [date, setDate] = useState<Date>()
    const [orgName, setOrgname] = useState<string>("");
    const [eventName, setEventname] = useState<string>("");
    const [recipientName, setRecipientName] = useState<string>("");
    const [aadhaarId, setAadhaarId] = useState<string>("");
    const [certificateImage, setCertificateImage] = useState<string>("");
    const [generating, setGenerating] = useState(false);
    const [open, setOpen] = useState(false);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [wallet, setWallet] = useState<string>("");
    const [downloadURL, setDownloadURL] = useState<string>("");

    useProtected()
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    
    function captureCanvasImage(canvas: HTMLCanvasElement): Promise<string> {
        return new Promise((resolve) => {
            const image = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
            resolve(image);
        });
    }

    function Download() {
        if (downloadURL.length > 0) {
            const link = document.createElement('a');
            link.href = downloadURL;
            link.download = 'certificate.pdf'; // Specify the filename
            link.click();

            // Revoke the URL to free up resources
            URL.revokeObjectURL(downloadURL);
        }
    }
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = () => {
        const input = inputRef.current;
        if (input?.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const result = e.target?.result as string;
                console.log(result);
                canvasImg=result;
            };

            reader.readAsDataURL(file);
        }
    };

    async function generateCertificate() {
        setGenerating(true);
        setOpen(false);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider?.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                CertificateVerification.abi,
                signer
            );

            const id = uuidv4()
            const canvas: HTMLCanvasElement | null = canvasRef.current!;
            canvas.width = 841.89 * 2;
            canvas.height = 595.28 * 2;
            const ctx = canvas.getContext('2d')!;
            ctx.imageSmoothingQuality = 'high';
            const bg = new Image();
            bg.setAttribute('crossorigin', 'anonymous');

            bg.src = canvasImg;
            console.log("Image:")
            console.log(bg.src);

            bg.onload = async () => {
                ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
                const qrurl = await QRCode.toDataURL(`https://smartcertify.vercel.app/verify/${id}`, { color: { dark: "#ffc000", light: "#00000000" }, width: 100 * 2 });
                const qr = new Image();
                qr.src = qrurl;
                qr.setAttribute('crossorigin', 'anonymous');
                qr.onload = async () => {
                    ctx.drawImage(qr, 78 * 2, 75 * 2, 80 * 2, 80 * 2);
                    ctx.font = "60px Comic Sans MS";
                    ctx.textAlign = "center";
                    ctx.fillText(recipientName, canvas.width / 2, canvas.height / 2 - 15 * 2);
                    ctx.font = "34px Comic Sans MS";
                    ctx.fillText("has successfully completed a training", canvas.width / 2, canvas.height / 2 + 50 * 2)
                    ctx.fillText(`programme on ${eventName.toUpperCase()}`, canvas.width / 2, canvas.height / 2 + 75 * 2)
                    ctx.fillText(`conducted by ${orgName.toUpperCase()}`, canvas.width / 2, canvas.height / 2 + 100 * 2)
                    ctx.fillText(date?.toString() ? date?.toString().split(" ").splice(1, 3).join(" ") : "", canvas.width / 2 + 20, canvas.height - 80)
                    var imgData = canvas.toDataURL("image/jpeg", 1.0);
                    const blob = dataURItoBlob(imgData);
                    setCertificateImage(imgData);
                    async function createPdfWithCanvasImage() {
                        const pdfDoc = await PDFDocument.create();
                        const pageWidth = 841.89; // A4 width in points (landscape)
                        const pageHeight = 595.28; // A4 height in points (landscape)
                        const page = pdfDoc.addPage([pageWidth, pageHeight]);
                        const imageBytes = await captureCanvasImage(canvas!);
                        const image = await pdfDoc.embedPng(imageBytes);
                        page.drawImage(image, {
                            x: 0,
                            y: 0,
                            width: pageWidth,
                            height: pageHeight,
                            opacity: 1,
                        });

                        type MetaDataOptions = {
                            author: string;
                            title: string;
                            keywords: string[];
                            creatorTool: string;
                            documentCreationDate: Date;
                            documentModificationDate: Date;
                            metadataModificationDate: Date;
                            subject: string,
                            producer: string,
                        }
                        const customMetadataKey = 'BlockCertificateID';
                        const customMetadataValue = id;

                        const options: MetaDataOptions = {
                            author: "SmartCertify",
                            title: `${eventName.toUpperCase()}-${recipientName.replaceAll(" ", "_")}`,
                            keywords: ["certificate", "blockchain"],
                            creatorTool: "SmartCertify",
                            documentCreationDate: new Date(),
                            documentModificationDate: new Date(),
                            metadataModificationDate: new Date(),
                            subject: `Certificate to ${recipientName.toUpperCase()} for ${eventName.toUpperCase()} by ${orgName.toUpperCase()}`,
                            producer: orgName.toUpperCase(),
                        }
                        const metadataXML = `
            <?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
              <x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.2-c001 63.139439, 2010/09/27-13:37:26        ">
                <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
        
                  <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
                    <dc:format>application/pdf</dc:format>
                    <dc:creator>
                      <rdf:Seq>
                        <rdf:li>${options.author}</rdf:li>
                      </rdf:Seq>
                    </dc:creator>
                    <dc:title>
                       <rdf:Alt>
                          <rdf:li xml:lang="x-default">${options.title}</rdf:li>
                       </rdf:Alt>
                    </dc:title>
                    <dc:subject>
                      <rdf:Bag>
                        ${options.keywords
                                .map(keyword => `<rdf:li>${keyword}</rdf:li>`)
                                .join('\n')}
                      </rdf:Bag>
                    </dc:subject>
                  </rdf:Description>
        
                  <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/">
                    <xmp:CreatorTool>${options.creatorTool}</xmp:CreatorTool>
                    <xmp:CreateDate>${options.documentCreationDate.toISOString()}</xmp:CreateDate>
                    <xmp:ModifyDate>${options.documentModificationDate.toISOString()}</xmp:ModifyDate>
                    <xmp:MetadataDate>${options.metadataModificationDate.toISOString()}</xmp:MetadataDate>
                  </rdf:Description>
        
                  <rdf:Description rdf:about="" xmlns:pdf="http://ns.adobe.com/pdf/1.3/">
                    <pdf:Subject>${options.subject}</pdf:Subject>
                    <pdf:Producer>${options.producer}</pdf:Producer>
                  </rdf:Description>

                  <rdf:Description rdf:about="" xmlns:${customMetadataKey}="${customMetadataValue}">
                    <blk:${customMetadataKey}>${customMetadataValue}</blk:${customMetadataKey}>
                  </rdf:Description>
        
                </rdf:RDF>
              </x:xmpmeta>
            <?xpacket end="w"?>
          `.trim();

                        const metadataStream = pdfDoc.context.stream(metadataXML, {
                            Type: 'Metadata',
                            Subtype: 'XML',
                            Length: metadataXML.length,
                        });

                        const metadataStreamRef = pdfDoc.context.register(metadataStream);
                        pdfDoc.catalog.set(PDFName.of('Metadata'), metadataStreamRef);
                        console.log("SET CUSTOM METADATA");
                        const pdfBytes = await pdfDoc.save();
                        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                        const url = URL.createObjectURL(blob);
                        setDownloadURL(url);
                    }

                    await createPdfWithCanvasImage();
                    const storageRef = ref(storage, `canvas-images/${id}.png`);
                    await uploadBytes(storageRef, blob);
                    const imageURL = await getDownloadURL(storageRef);
                    console.log(imageURL);

                    try {
                        const response = await contract.issueCertificate(id, recipientName, aadhaarId, imageURL, BigInt(date?.getMilliseconds()!));
                        await response.wait();
                        console.log("response:", response);
                        const docRef = await addDoc(collection(db, `/aadharNo/${aadhaarId}/certificate`), {
                            issuerName: orgName,
                            imgLink: imageURL,
                            eventName: eventName,
                            issuedOn: serverTimestamp()
                        })
                        setOpen(true);
                        setGenerating(false);
                    } catch (error) {
                        {
                            toast.error(`Error : User rejected Transaction`, { theme: "dark", toastId: "mreject-eror" },);
                        }
                        //  Transcation failed....
                        deleteObject(storageRef)
                            .then(() => console.log("deleted File from firebase due to transaction failure!"))
                            .catch((error) => console.log("error deleting image from firebase"));
                        setOpen(false);
                        setGenerating(false);
                    }
                };
            }
        } catch (error) {
            {
                toast.error(`Unknown Error ${error}`, { theme: "dark", toastId: "munknown-eror" },);
            }
            setGenerating(false);
            setOpen(false);
        }
    }

    

    const dataURItoBlob = (dataURI: string) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    };


    return (
        <div className="flex items-center justify-center h-screen">
            <BackButton url="/organization/dash" disabled={generating} />
            <canvas hidden ref={canvasRef}></canvas>
            {metaMask ? <Card className="md:m-0 m-2">
                <CardHeader>
                    <div>
                        <h2 className="text-3xl font-semibold">Issue Cerificate</h2>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Issue a certificate on the blockchain
                        </p>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent>
                    <div className="space-y-3 p-3">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="org-name">Organisation Name</Label>
                                    <Input id="org-name" placeholder="Enter the organistation name" value={orgName} onChange={(e: FormEvent<HTMLInputElement>) => {
                                        e.preventDefault();
                                        setOrgname(e.currentTarget.value);
                                    }} type="text" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="event-name">Event Name</Label>
                                    <Input id="event-name" placeholder="Enter event name" value={eventName} onChange={(e: FormEvent<HTMLInputElement>) => {
                                        e.preventDefault();
                                        setEventname(e.currentTarget.value);
                                    }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Enter the recipient name" type="text" value={recipientName} onChange={(e: FormEvent<HTMLInputElement>) => {
                                    e.preventDefault();
                                    setRecipientName(e.currentTarget.value);
                                }} />
                            </div>
                            <div className="space-y-2">
                                <Label>Aadhar id</Label>
                                <Input id="aadhar" placeholder="Enter the aadhar id" type="text" value={aadhaarId} onChange={(e: FormEvent<HTMLInputElement>) => {
                                    e.preventDefault();
                                    setAadhaarId(e.currentTarget.value);
                                }} />
                            </div>
                            <div className="flex gap-2 flex-col md:flex-row">
                                <div className="flex flex-col">
                                    <Label>Issue Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[280px] justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="grid w-full max-w-sm items-center ">
                                    <Label htmlFor="template">Template</Label>
                                    <Input id="template"
                                        type="file"
                                        ref={inputRef}
                                        accept="image/*"
                                        onChange={handleFileChange} />
                                </div>
                            </div>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <Button variant="default" className={cn("w-[180px]")} disabled={generating} onClick={generateCertificate}>{generating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /><span>Generating...</span></> : <span>Generate</span>}</Button>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Certificate Generated</DialogTitle>
                                        <DialogDescription>
                                            This certificate is successfully stored on the blockchain
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Separator />
                                    <div className="w-full justify-center flex gap-4 py-4 items-center">
                                        <NextImage width={300} height={300} src={certificateImage} alt="" crossOrigin="anonymous" />
                                    </div>
                                    <Separator />
                                    <DialogFooter>
                                        <Button type="submit" onClick={Download}>Download</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card> : <div className="flex w-full h-full justify-center items-center ">
                <div className="text-[90px] text-center text-white"> Install MetaMask !!</div></div>}

        </div>
    )
}
