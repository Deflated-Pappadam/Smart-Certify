import { auth } from '@/lib/firebase';
import { getAddress } from 'ethers'
import { signInWithEmailAndPassword } from 'firebase/auth';
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        type: { label: "authType", type: "text" }, // Can be either web2 or web3
        address: { label: "walletAddress", type: "text" },
        email: { label: "userEmail", type: "text"  },
        password: { label: "userPassword", type: "text"  },
      },
      async authorize(credentials): Promise<any> {
        if (
          !credentials?.type ||
          (credentials?.type !== "web2" && credentials?.type !== "web3")
        ) {
          throw new Error("Must Specify Type of Login");
        }
        if (credentials.type == "web3") {
          if (!Boolean(getAddress(credentials?.address!))) {
            throw new Error("Invalid Wallet");
          }
          return {
            id: credentials?.address,
            name: credentials?.type, 
          };
        }
        else {
          if (!credentials.email || !credentials.password) throw new Error("Email and password not provided");
          const {user} = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          return { email: user.email, name: credentials.type }
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async session({ session, token }) {
      if (token.email) {
        session.user.email = token.email;
      }
      if (token.sub) {
        session.user.address = token.sub as string;
      }
      return session
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    newUser: '/',
  },
});

export { handler as GET, handler as POST };