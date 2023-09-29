"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main>
      <div className='flex flex-col items-center justify-center w-full h-full min-h-screen'>
        <div className='text-[150px] text-center' >Smart Certify</div>
        <div className="flex gap-x-3">
          <Button asChild className="w-[220px] py-3 text-xl">
            <Link href="/organization/login">Organization</Link>
          </Button>
          <Button asChild className="w-[220px] py-3 text-xl">
            <Link href="/user/dash">User</Link>
          </Button>
        </div>

      </div>
    </main>
  )
}