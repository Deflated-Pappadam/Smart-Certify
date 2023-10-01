import { getAddress } from "ethers";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware"

export default withAuth(
    {
        callbacks: {
            authorized: async ({ req }) => {
                const token = await getToken({
                    req,
                    secret: process.env.JWT_SECRET
                })
                if (!token) return false;
                else {
                    if (token.name === "web3") return Boolean(getAddress(token?.sub ?? ""));
                    else return false;
                }
            },
        },
        pages: {
            signIn: '/organization/login',
            error: '/',
        }
    })

export const config = { matcher: ["/organization/dash", "/organization/dash/:path*", "/user/dash"] }