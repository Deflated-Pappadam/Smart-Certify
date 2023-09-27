"use client"
import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table} from "@/components/ui/table"
import { Card, CardHeader } from "@/components/ui/card"
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover"
import Image from "next/image"
import { db } from "@/utils/firebase"
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react"


export default function Component() {
  const [allData, setAllData] = useState([]);
  useEffect(() => {
    async () => {
      const data = await getDocs(collection(db, "certificates"))
      
    }
  })
  
  return (
    <div>
      <main className="flex-grow p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-medium">My Certificates</h1>
          <Card className="w-[300px] h-100px bg-slate-100">
            <CardHeader>Rhon S George</CardHeader>
          </Card>
        </div>
        <Table className="mt-8">
          <TableHeader>
            <TableRow>
              <TableHead>Date of Issue</TableHead>
              <TableHead>Issuer Name</TableHead>
              <TableHead>Event Name</TableHead>
              <TableHead className="text-right">Certificate</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* <TableRow>
              <TableCell>Sept 27</TableCell>
              <TableCell>WeWork</TableCell>
              <TableCell>
                <span className="text-black-800 rounded-md">
                  Office
                </span>
              </TableCell>
              <TableCell className="text-right">
                <button className="px-3 py-2 bg-blue-400 rounded-lg text-white">
                  View
                </button>
              </TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </main>
    </div>
  )
}
