import { getAddress } from 'ethers'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        type: { label: "type", type: "text" }, // Can be either web2 or web3
        address: { label: "walletAddress", type: "text" },
      },
      async authorize(credentials) {
        if (!Boolean(getAddress(credentials?.address!))) {
          throw new Error("Invalid Wallet");
        }
        return {
          id: credentials?.address,
          name: credentials?.type, 
        } as any;
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
      session.user.address = token.sub as string;
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    newUser: '/',
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };