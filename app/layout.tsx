import { ModeToggle } from '@/components/ThemeSwitch';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from '@/components/ui/toaster';
import WagmiContext from '@/context/WagmiContext';
import type { Metadata } from 'next';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import AuthContext from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Smart Certify',
  description: 'A Blockchain based certificate generator and validation system',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <AuthContext>
            <WagmiContext>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <ModeToggle />
                {children}
              </ThemeProvider>
            </WagmiContext>
          </AuthContext>

          <Toaster />
        </body>
      </html>
    </>
  )
}
