"use client";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db, storage } from "@/lib/firebase";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Component() {
  const [allData, setAllData] = useState<DocumentData[]>([]);
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log(session)
    if(!session?.user) return;
    const unsub = onSnapshot(collection(db, `/aadharNo/${session.user.address}/certificate`), (snapshot) => {
      setAllData(
        snapshot.docs.map((doc) => {
          return doc.data();
        })
      );
    });
    return () => {
      unsub();
    };
  }, [session]);

  function downloadPdf(id: string) {
    const storageRef = ref(storage, `canvas-pdfs/${id}.png`);
    getDownloadURL(storageRef).then((url)=> {
      var link = document.createElement("a");
      if (link.download !== undefined) {
          link.setAttribute("href", url);
          link.setAttribute("target", "_blank");
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
    });
  }


  return (
    <div>
      <main className="flex-grow p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-medium">My Certificates</h1>
          <Card className="w-[300px] h-100px bg-slate-100 dark:text-black">
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
            {allData.map((row, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell>{new Date(row.issuedOn.seconds * 1000).toString().split(" ").splice(0, 4).join(" ")}</TableCell>
                  <TableCell>{row.issuerName}</TableCell>
                  <TableCell>
                    <span className="text-black-800 rounded-md">{row.eventName}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <a onClick={() => downloadPdf(row.id)} target="blank" className="px-3 py-2 bg-blue-400 rounded-lg text-white">
                      Download
                    </a>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}

Component.requireAuth = true;