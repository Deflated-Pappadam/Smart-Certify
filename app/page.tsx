"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="w-full h-full min-h-screen">
      <div className="flex flex-col w-full h-full items-center justify-center min-h-screen">
        <div className="md:text-[150px] text-[90px] text-center">Smart Certify</div>
        <div className="md:text-[25px] text-[20px] font-light mb-4 text-center w-[80%]">A blockchain based certificate verification system.</div>
        <div className="flex md:flex-row flex-col gap-3 p-4">
          <Button asChild className="w-[200px] p-6 text-xl rounded-3xl">
            <Link href="/organization/dash">Organization</Link>
          </Button>
          <Button asChild className="w-[200px] p-6 text-xl rounded-3xl border border-black  bg-white text-black">
            <Link href="/user/dash">User</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}