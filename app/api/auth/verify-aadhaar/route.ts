import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: Request) {
    const body = await request.json();
    const { email, aadhaarNo } = body;
    try {
        const docRef = doc(db, "registeredAadhaarNos", aadhaarNo);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            if ((docSnap.data() as {email: string, aadhaarNo: string}).email === email) {
                return NextResponse.json({ message: "AadhaarNo verified with email" }, { status: 200 })
            } 
            return NextResponse.json({ error: "A User with that aadhaar no already exists" }, { status: 400 })
        }
        return NextResponse.json({ error: "This user is not yet registered" }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create a new User" }, { status: 400 })     
    }
}