"use client"

import PdfMetadataReader from "@/components/PdfMetadata"

export default function Home() {
  return (
    <main>
      <div className='flex flex-col items-center justify-center w-full h-full min-h-screen'>
        <div className='text-[150px] text-center' >Smart Certify</div>
       <a href="/generate"  className="flex items-center justify-center bg-black w-[150px] h-[60px] text-white  text-3xl text-center rounded-xl hover:bg-slate-900 hover:text-slate-400">Generate</a>
      </div>
      <PdfMetadataReader />
    </main>
  )
}