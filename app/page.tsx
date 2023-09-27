"use client"
import Image from 'next/image'
import { Canvas } from '@/utils/getCertificate'

export default function Home() {
  const certDetails = {
    name: "RIYANNA MARIA ABISON",
    event: "SWAYAM",
    type: "WEB DEVELOPMENT",
    qrLink: "https://cdn.discordapp.com/attachments/946819313342500914/1156447200839204935/of_participation.png?ex=651500e2&is=6513af62&hm=dd10af8d521374fe8f5a8e7cf4a13f35dc40ac5df17fecfd6d0be02966d7e334&"
  }
  return (
    <main>
      <div className='flex items-center justify-center w-full h-full min-h-screen'>
        <div className='text-[150px] text-center' >Smart Certify</div>
      </div>
    </main>
  )
}