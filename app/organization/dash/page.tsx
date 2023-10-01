"use client"
import BackButton from "@/components/BackButton"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useProtected } from "@/hooks/useProtected"
import { ArrowUpRight, Building2 } from "lucide-react"
import Link from "next/link"

export default function Page() {
    useProtected();
    return (
        <div className="min-h-screen flex flex-col pt-10 justify-center text-center items-center" >
            <BackButton url="/"/>
            <Building2 size={86} className="pb-3" />
            <h2>this shows the details about the organization</h2>
            <h1 className="font-bold">An organization can perform the following</h1>
            <div className="flex flex-col gap-y-2 md:flex-row gap-x-5 py-5">
                <Card className="flex flex-col w-[300px] text-start justify-around">
                    <CardHeader>
                        <CardTitle>Issue Certificate</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="py-2 font-thin">
                        <p>You can issue certificates which are directly connected to the blockchain</p>
                    </CardContent>
                    <CardFooter className="flex h-full py-3 w-full justify-end">
                        <Link href="/organization/dash/issue" className={buttonVariants({ variant: "default" }) + "group w-full"}>
                            <span className="flex items-center justify-center group w-full">
                                Go
                                <ArrowUpRight className="group-hover:[transform:rotate(45deg)] duration-200" />
                            </span>
                        </Link>
                    </CardFooter>
                </Card>
                <Card className="w-[300px] text-start">
                    <CardHeader>
                        <CardTitle>Verify Certificate</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="py-2 font-thin">
                        <p>You can verify the authenticity of certificates which are stored on the blockchain</p>
                    </CardContent>
                    <CardFooter className="py-3">
                        <Link href="/organization/dash/verify" className={buttonVariants({ variant: "default" }) + "group w-full"} >
                            <span className="flex items-center justify-center group w-full">
                                Go
                                <ArrowUpRight className="group-hover:[transform:rotate(45deg)] duration-200" />
                            </span>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}