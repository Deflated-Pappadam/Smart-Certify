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
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import BackButton from '@/components/BackButton';


function Page() {
    const [email, setEmail] = useState("");

    function resetPassword(): void {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                toast({variant: "default", title: "Sent Reset Email", description: "A password reset mail has been sent to your email."})
            })
            .catch((error) => {
                // const errorCode = error.code;
                console.log(error);
                toast({variant: "destructive", description: `Failed to send reset password request.`})
            });
    }

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <BackButton url="/user/forgot-password"/>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>Enter your credentials</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-7">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Email</Label>
                                <Input onChange={(e)=> {setEmail(e.target.value)}} value={email} id="name" placeholder="Enter the Email" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button disabled={!email} onClick={resetPassword} className='w-full'>Reset Password</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page