"use client"

import PdfMetadataReader from "@/components/PdfMetadata"

export default function Home() {
  return (
    <main>
      <div className='flex items-center justify-center w-full h-full min-h-screen'>
        <div className='text-[150px] text-center' >Smart Certify</div>
      </div>
      <PdfMetadataReader />
    </main>
  )
}