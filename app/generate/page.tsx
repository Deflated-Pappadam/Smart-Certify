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
""

var pdf = new jsPDF("l","pt","a4");
function Download(){
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function generateCertificate() {
    setGenerating(true);
    const canvas: HTMLCanvasElement | null = canvasRef.current!;
    canvas.width = 800;
    canvas.height = 565.5;
    const ctx = canvas.getContext('2d')!;
    const bg = new Image();
    bg.setAttribute('crossorigin', 'anonymous');
    bg.src = "https://cdn.discordapp.com/attachments/946819313342500914/1156447200839204935/of_participation.png?ex=651500e2&is=6513af62&hm=dd10af8d521374fe8f5a8e7cf4a13f35dc40ac5df17fecfd6d0be02966d7e334&";
    bg.onload = () => {
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      const qr = new Image();
      qr.src = "https://cdn.discordapp.com/attachments/930377076324839474/1156480301338476586/default-preview-qr.png?ex=65151fb6&is=6513ce36&hm=d8ab1cb327a08ffc188bcea89fd2fd548a84c43d60d857082b75cc3ce66bba32&";
      qr.setAttribute('crossorigin', 'anonymous');
      qr.onload = () => {
        ctx.drawImage(qr,82, 80, 60, 60);
        ctx.font = "30px Comic Sans MS";
        ctx.textAlign = "center";
        ctx.fillText(recipientName, canvas.width/2, canvas.height/2-15);
        ctx.font = "17px Comic Sans MS";
        ctx.fillText("has successfully completed a training", canvas.width/2, canvas.height/2+40)
        ctx.fillText(`programme on ${eventName}`, canvas.width/2, canvas.height/2+65)
        ctx.fillText(`conducted by ${orgName}`, canvas.width/2, canvas.height/2+90)
  
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        setCertificateImage(imgData);
        pdf.addImage(imgData, 'JPEG', 0, 0, 842, 595);
        setGenerating(false);
      }
      //  pdf.setProperties({
      //   "title":"ewfkukewbczxtqtu313jk8274hj"
      //  })
       

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


              <Dialog open={generating}>
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
                  <div className="grid gap-4 py-4">
                      <img width={100} height={100} src={certificateImage} alt="" crossOrigin="anonymous"  />
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
