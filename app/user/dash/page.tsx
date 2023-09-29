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
import { db } from "@/utils/firebase";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Component() {
  const [allData, setAllData] = useState<DocumentData[]>([]);

  // useEffect(() => {
  //   fetchAll();
  // }, []);

  // const fetchAll = async () => {
  //   const data = await getDocs(collection(db, "certificates"));
  //   setAllData(data.docs);
  //   console.log(data);
  // };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "certificates"), (snapshot) => {
      setAllData(
        snapshot.docs.map((doc) => {
          return doc.data();
        })
      );
    });
    return () => {
      console.log(allData);
      unsub();
    };
  }, []);


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
            {allData.map((row) => {
              console.log(row);
              return (
                <TableRow>
                  <TableCell>Sept 27</TableCell>
                  <TableCell>{row.issuerName}</TableCell>
                  <TableCell>
                    <span className="text-black-800 rounded-md">Office</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="px-3 py-2 bg-blue-400 rounded-lg text-white">
                      View
                    </button>
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
