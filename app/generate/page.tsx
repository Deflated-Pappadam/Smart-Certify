"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectLabel, SelectItem, SelectGroup, SelectContent, Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CardContent, Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import jsPDF from "jspdf"
import QRCode from 'qrcode'
import CertificateVerification from "@/src/artifacts/contracts/CertificateVerification.sol/CertificateVerification.json";
import { BigNumber, ethers } from "ethers"
import { v4 as uuidv4 } from 'uuid';
import { storage, db } from "@/utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { addDoc, collection } from "firebase/firestore"

declare global {
  interface Window {
    ethereum?: any
  }
}
const contractAddress = "0x76a737Dd55906b8D679C6826a873Bf9FCc8e0aB2";
var pdf = new jsPDF("l", "pt", "a4");
function Download() {
  pdf.save("certificate.pdf");

}
export default function Component() {
  const [date, setDate] = useState<Date>()
  const [orgName, setOrgname] = useState<string>("");
  const [eventName, setEventname] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [aadhaarId, setAadhaarId] = useState<string>("");
  const [certificateImage, setCertificateImage] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [open, setOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  async function generateCertificate() {
    setGenerating(true);
    const provider = new ethers.providers.Web3Provider(
      window?.ethereum
  );
  const signer = provider?.getSigner();
  const contract = new ethers.Contract(
      contractAddress,
      CertificateVerification.abi,
      signer
  );
    
    const id = uuidv4()
    const canvas: HTMLCanvasElement | null = canvasRef.current!;
    canvas.width = 800;
    canvas.height = 565.5;
    const ctx = canvas.getContext('2d')!;
    const bg = new Image();
    bg.setAttribute('crossorigin', 'anonymous');
    bg.src = "https://cdn.discordapp.com/attachments/946819313342500914/1156447200839204935/of_participation.png?ex=651500e2&is=6513af62&hm=dd10af8d521374fe8f5a8e7cf4a13f35dc40ac5df17fecfd6d0be02966d7e334&";
    bg.onload = async () => {
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      
      const qrurl = await QRCode.toDataURL(`http://localhost:3000/verify/${id}`);
      const qr = new Image();
      qr.src = qrurl;
      qr.setAttribute('crossorigin', 'anonymous');
      qr.onload = async () => {
        ctx.drawImage(qr, 82, 80, 60, 60);
        ctx.font = "30px Comic Sans MS";
        ctx.textAlign = "center";
        ctx.fillText(recipientName, canvas.width / 2, canvas.height / 2 - 15);
        ctx.font = "17px Comic Sans MS";
        ctx.fillText("has successfully completed a training", canvas.width / 2, canvas.height / 2 + 40)
        ctx.fillText(`programme on ${eventName.toUpperCase()}`, canvas.width / 2, canvas.height / 2 + 65)
        ctx.fillText(`conducted by ${orgName.toUpperCase()}`, canvas.width / 2, canvas.height / 2 + 90)

        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        
        // Create a Blob from the data URL
        const blob = dataURItoBlob(imgData);
        setCertificateImage(imgData);
        pdf.addImage(imgData, 'JPEG', 0, 0, 842, 595);
        setGenerating(false);
        setOpen(true);

        // Get a reference to the Firebase Storage bucket and specify the path
        const storageRef = ref(storage, 'canvas-images/canvas-image.png');

        // Upload the Blob to Firebase Storage
        await uploadBytes(storageRef, blob);
        const imageURL = await getDownloadURL(storageRef);
        const docRef = await addDoc(collection(db, 'certificates'), {
          issuerName: {orgName},
          imgLink: {imageURL},
          eventName: {eventName}
        })

       const response = await contract.issueCertificate(id, recipientName, aadhaarId, imageURL, BigNumber.from(date?.getMilliseconds()));
       await response.wait(); 
       console.log("response:", response);
       
      };

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

      // fetch url from firestore
      // const storageRef = ref(storage);
      // uploadBytes(storageRef, blob).then((snapshot) => {
      //   console.log('Uploaded a blob or file!');
      // });


    }
}





return (
  <div className="flex items-center justify-center h-screen bg-black ">
    <canvas hidden ref={canvasRef}>  </canvas>;
    <Card>
      <CardContent>
        <div className="space-y-8 p-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Issue Cerificates</h2>
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


            <Dialog>
              <DialogTrigger >
                <Button variant="outline" onClick={generateCertificate} className="bg-gray-800 text-white" type="submit">Generate Certificate</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Certificate Generated</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when youre done.
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full justify-center flex gap-4 py-4 items-center">
                  <img width={300} height={300} src={certificateImage} alt="" crossOrigin="anonymous" />
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={Download}>Download</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </div>
      </CardContent>
    </Card>

  </div>
)
}
