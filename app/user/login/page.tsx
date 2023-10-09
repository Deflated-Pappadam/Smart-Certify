"use client";
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios';
import { UserCredential } from 'firebase/auth';
import { signIn, useSession } from 'next-auth/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import BackButton from '@/components/BackButton';

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [aadhaarNo, setAadhaarNo] = useState("");
  const router = useRouter()

  function SignIn() {
    setSigningIn(true);
    axios
      .post("/api/auth/verify-aadhaar", {
        email,
        aadhaarNo,
      })
      .then((response) => {
        if (response.status === 200) {
          signIn("credentials", {
            type: "web2",
            email: email,
            password: password,
            callbackUrl: "/user/dash",
            redirect: false,
          }).then((res)=> {
            console.log(res);
            if (res?.error) {
              console.log(res?.error);
              toast({variant: "destructive", description: res?.error});
              setSigningIn(false);
            }
            if (res?.url) {
              setSigningIn(false);
              router.push(res.url);
            }

          }).catch((err) => {
            setSigningIn(false);
            console.log(err);
            toast({variant: "destructive", description: "Failed to create user"})
          });
        }
      })
      .catch((err) => {
        setSigningIn(false);
        console.log(err);
        toast({variant: "destructive", description: "Failed to create user"})
      });
  }

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <BackButton url="/"/>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Create your smart certify locker</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className='pt-3'>
          <form>
            <div className="grid w-full items-center gap-7">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input onChange={(e)=> setEmail(e.target.value)} value={email} id="email" placeholder="Enter the Email" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="aadhaar">Aadhaar number</Label>
                <Input onChange={(e)=> setAadhaarNo(e.target.value)} value={aadhaarNo} id="aadhaar" placeholder="Enter the Aadhaar number" />
              </div>
              <div className="flex flex-col space-y-1.5 relative">
                <Label htmlFor="password">Password</Label>
                <Input onChange={(e)=> setPassword(e.target.value)} value={password} type={showPassword ? 'text' : 'password'} id="password" placeholder="Enter the password" />
                <div className="absolute inset-y-9 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                  {showPassword ? (
                    <Eye onClick={()=> setShowPassword(false)} />
                  ) : (
                    <EyeOff onClick={()=> setShowPassword(true)} />
                  )}
                </div>
                <Button className='justify-start font-normal w-max m-0 px-0 h-2 py-3' asChild variant="link"><Link href={"/user/forgot-password"}>forgot password?</Link></Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-between">
          <Button disabled={!email || !password || !aadhaarNo} onClick={SignIn} className='w-full'><>{signingIn ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /><span>Signing In...</span></> : <span>Sign In</span>}</></Button>
          <span className='flex items-center py-2'><p className='text-muted-foreground text-sm'>not a member</p><Button className='justify-start w-max m-0 px-0 pl-[1ch] h-2 py-3' asChild variant="link"><Link href={"/user/signup"}>Sign Up</Link></Button></span>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUpPage

SignUpPage