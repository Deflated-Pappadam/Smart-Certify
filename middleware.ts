import { getAddress } from "ethers";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware"
import { NextFetchEvent, NextRequest } from "next/server";

export default async function middleware(req: NextRequest , event: NextFetchEvent) {
    let withAuthMiddleware: any | null = null;
    if (req.nextUrl.pathname.startsWith("/user/dash")) {
        withAuthMiddleware = withAuth({
            callbacks: {
                authorized: async ({ req }) => {
                    const token = await getToken({
                        req,
                        secret: process.env.JWT_SECRET
                    })                    
                    if (!token) return false;
                    else {
                        if (token.name === "web3") return Boolean(getAddress(token?.sub ?? ""));
                        else if (token.name === "web2") return !!token.email;
                        else return false;
                    }
                },
            },
            pages: {
                signIn: '/user/login',
                error: '/',
            }
        });
    } else {
        withAuthMiddleware = withAuth({
            callbacks: {
                authorized: async ({ req }) => {
                    const token = await getToken({
                        req,
                        secret: process.env.JWT_SECRET
                    })
                    if (!token) return false;
                    else {
                        if (token.name === "web3") return Boolean(getAddress(token?.sub ?? ""));
                        if (token.name === "web2") return !!token.email;
                        else return false;
                    }
                },
            },
            pages: {
                signIn: '/organization/login',
                error: '/',
            }
        });
    }
    return await withAuthMiddleware(req, event);
}

// export default withAuth(
//     {

//         callbacks: {
//             authorized: async ({ req }) => {
//                 const token = await getToken({
//                     req,
//                     secret: process.env.JWT_SECRET
//                 })
//                 if (!token) return false;
//                 else {
//                     if (token.name === "web3") return Boolean(getAddress(token?.sub ?? ""));
//                     else return false;
//                 }
//             },
//         },
//         pages: {
//             signIn: '/organization/login',
//             error: '/',
//         }
//     })

export const config = { matcher: ["/organization/dash", "/organization/dash/:path*", "/user/dash"] }