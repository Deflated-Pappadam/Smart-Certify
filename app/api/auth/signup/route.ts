import { NextResponse } from "next/server";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";

export async function POST(request: Request) {
    const body = await request.json();

    const { email, name, password, aadhaarNo } = body;    
    try {
        const docRef = doc(db, "registeredAadhaarNos", aadhaarNo);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return NextResponse.json({ error: "A User with that aadhaar no already exists" }, { status: 400 })
        await createUserWithEmailAndPassword(auth, email, password);
        const usersRef = collection(db, "registeredAadhaarNos");
        await setDoc(doc(usersRef, aadhaarNo), {
            name,
            aadhaarNo,
            email,
        })
        return NextResponse.json({ error: "Created User Successfully", name, aadhaarNo, email }, { status: 200 })
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create a new User" }, { status: 400 })
    }
}