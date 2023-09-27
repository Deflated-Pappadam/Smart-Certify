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
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

export default function Component() {
  const [date, setDate] = useState<Date>()
  const [orgName, setOrgname] = useState<string>("");
  const [eventName, setEventname] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [aadhaarId, setAadhaarId] = useState<string>("");

  return (
    <div className="flex items-center justify-center h-screen bg-black ">

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
                    }} type="text"/>
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
                    }}/>
              </div>
              <div className="space-y-2">
                <Label>Aadhar id</Label>
                <Input id="aadhar" placeholder="Enter the aadhar id" type="text" value={aadhaarId} onChange={(e: FormEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    setAadhaarId(e.currentTarget.value);
                    }}/>
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
              <Button className="bg-gray-800 text-white" type="submit" >
                Generate Certificate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
