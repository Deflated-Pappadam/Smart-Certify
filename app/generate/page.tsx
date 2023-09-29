"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent, Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { FormEvent, useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PDFDocument, PDFName, PDFObject, PDFObjectStream, PDFRawStream, PDFRef } from 'pdf-lib'
import QRCode from 'qrcode'
import CertificateVerification from "@/artifacts/contracts/CertificateVerify.sol/CertificateVerification.json";
import { ethers } from "ethers"
import { v4 as uuidv4 } from 'uuid';
import { storage, db } from "@/utils/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { Separator } from "@/components/ui/separator"
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { captureCanvasImage } from "@/utils/helper"

declare global {
  interface Window {
    ethereum?: any
  }
}
const contractAddress = "0xEFB8357E5A292c195a20119C784EaeF0e2d6Afe8";

export default function Component() {
  const [metaMask,setMetaMask]=useState(true);
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.ethereum == null) {
      setMetaMask(false);

      {
        toast.error("MetaMask Not Installed", { theme: "dark", toastId: "meta-not-installed" },);
      }
      console.log("MetaMask not installed");

    } else {
      setMetaMask(true);
      window.ethereum.request({ method: "eth_requestAccounts" }).then(async (accounts: string[]) => {
        setWallet(accounts[0]);
        setProvider(new ethers.BrowserProvider(window.ethereum));
        if (provider) setSigner(await provider.getSigner());
      });
    }
  }, [])

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
      bg.src = "https://cdn.discordapp.com/attachments/946819313342500914/1157381635214413834/of_participation.png?ex=65186724&is=651715a4&hm=c775ce17a5caff93d620f1cf9a5137775b0e8ce7ce877a1ea79bc0a07c2a6e53&";
      bg.onload = async () => {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        const qrurl =  await QRCode.toDataURL(`https://sihhack.vercel.app/verify/${id}`, {color: {dark: "#ffc000", light: "#00000000"}, width: 100 * 2});
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
          ctx.fillText(`conducted by ${orgName.toUpperCase()}`, canvas.width / 2 , canvas.height / 2 + 100 * 2)
          ctx.fillText(date?.toString() ? date?.toString().split(" ").splice(1,3).join(" ") : "", canvas.width/2+20,canvas.height-80)

          var imgData = canvas.toDataURL("image/jpeg", 1.0);

          // Create a Blob from the data URL
          const blob = dataURItoBlob(imgData);
          setCertificateImage(imgData);
          async function createPdfWithCanvasImage() {
            // Create a new PDF document
            const pdfDoc = await PDFDocument.create();
          
            // Add a new page to the document with A4 size in landscape orientation
            const pageWidth = 841.89; // A4 width in points (landscape)
            const pageHeight = 595.28; // A4 height in points (landscape)
            const page = pdfDoc.addPage([pageWidth, pageHeight]);
          
            // Capture an image from an HTML canvas (replace 'canvasId' with your canvas element's ID)
            const imageBytes = await captureCanvasImage(canvas!);
          
            // Embed the captured image on the page
            const image = await pdfDoc.embedPng(imageBytes);
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: pageWidth,
              height: pageHeight,
              opacity: 1, // Opacity (1 for fully opaque)
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

            console.log(options);
            
            
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
                    <${customMetadataKey}:${customMetadataKey}>${customMetadataValue}</${customMetadataKey}:${customMetadataKey}>
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
            // Serialize the PDF document
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            // Create a URL for the Blob
            const url = URL.createObjectURL(blob);
            setDownloadURL(url);
            const pdfPath = '../../test.pdf';
          }

          await createPdfWithCanvasImage();
          // pdf.addImage(imgData, 'JPEG', 0, 0, 842, 595);
          // Get a reference to the Firebase Storage bucket and specify the path
          const storageRef = ref(storage, `canvas-images/${id}.png`);
          // Upload the Blob to Firebase Storage
          await uploadBytes(storageRef, blob);
          const imageURL = await getDownloadURL(storageRef);
          console.log(imageURL);
          try {
            const response = await contract.issueCertificate(id, recipientName, aadhaarId, imageURL, BigInt(date?.getMilliseconds()!));
            await response.wait();
            console.log("response:", response);
            const docRef = await addDoc(collection(db, 'certificates'), {
              issuerName: orgName,
              imgLink: imageURL,
              eventName: eventName,
              issuedOn: serverTimestamp()
            })
            setOpen(true);
            setGenerating(false);
          } catch (error) {
            {
              toast.error(`Error : User rejected Transaction`, { theme: "dark", toastId: "munknown-eror" },);
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


  // Helper function to convert data URL to Blob
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
    <div className="flex items-center justify-center h-screen bg-black ">
      <canvas hidden ref={canvasRef}>  </canvas>;
      {metaMask?<Card>
        <CardContent>
          <div className="space-y-8 p-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">Issue Cerificate</h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Blah Blah blahdhjgf sjhgf
              </p>
            </div>
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
              <div className="flex flex-col space-y-2">
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
                    <img width={300} height={300} src={certificateImage} alt="" crossOrigin="anonymous" />
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
      </Card>:<div className="flex w-full h-full justify-center items-center ">
        <div className="text-[90px] text-center text-white"> Install MetaMask !!</div></div>}

    </div>
  )
}
