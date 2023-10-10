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
import { signIn } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import { useRouter } from 'next/navigation';

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [aadhaarNo, setAadhaarNo] = useState("");
  const router = useRouter()

  function SignUp() {
    axios
      .post("/api/auth/signup", {
        email,
        name,
        aadhaarNo,
        password
      })
      .then((response) => {
        console.log(response);
        
        if (response.status === 200) {
          signIn("credentials", {
            type: "web2",
            email: email,
            password: password,
            aadhaarNo: aadhaarNo,
            callbackUrl: "/user/dash",
            redirect: false,
          }).then((res)=> {
            console.log(res);
            if (res?.error) {
              console.log(res?.error);
              toast({variant: "destructive", description: res?.error});
            }
            if (res?.url) {
              router.push(res.url);
            }
          }).catch((err) => {
            console.log(err);
            toast({variant: "destructive", description: "Failed to create user"})
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast({variant: "destructive", description: "Failed to create user"})
      });
  }

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <BackButton url="/user/login"/>
      <Card className='md:min-w-[500px] min-w-[350px]'>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
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
                <Label htmlFor="name">Name</Label>
                <Input onChange={(e)=> setName(e.target.value)} value={name} id="name" placeholder="Enter your name" />
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
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-between">
          <Button disabled={!email || !password || !aadhaarNo || !name} onClick={SignUp} className='w-full'>Sign Up</Button>
          <span className='flex items-center py-2'><p className='text-muted-foreground text-sm'>already have an account</p><Button className='justify-start w-max m-0 px-0 pl-[1ch] h-2 py-3' asChild variant="link"><Link href={"/user/login"}>Sign In</Link></Button></span>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUpPage