"use client";
import { useRef, useEffect } from 'react';

type props = {
  name: string;
  event: string;
  type: string
  qrLink: string
}


export function Canvas(props: props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current!;
    canvas.width = 800;
    canvas.height = 565.5;
    const ctx = canvas.getContext('2d')!;
    const bg = new Image();
    bg.src = props.qrLink;
    bg.onload = () => {
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      const qr = new Image();
      qr.src = "https://cdn.discordapp.com/attachments/930377076324839474/1156480301338476586/default-preview-qr.png?ex=65151fb6&is=6513ce36&hm=d8ab1cb327a08ffc188bcea89fd2fd548a84c43d60d857082b75cc3ce66bba32&";
      qr.onload = () => {
        ctx.drawImage(qr,82, 80, 60, 60);
      }
      
      ctx.font = "30px Comic Sans MS";
      ctx.textAlign = "center";
      ctx.fillText(props.name, canvas.width/2, canvas.height/2-15);
      ctx.font = "17px Comic Sans MS";
      ctx.fillText("has successfully completed a training", canvas.width/2, canvas.height/2+40)
      ctx.fillText(`programme on ${props.type}`, canvas.width/2, canvas.height/2+65)
      ctx.fillText(`conducted by ${props.event}`, canvas.width/2, canvas.height/2+90)
    }

  }, []);

  return <canvas ref={canvasRef}>  </canvas>;
}