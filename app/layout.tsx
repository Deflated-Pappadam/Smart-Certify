import { ModeToggle } from '@/components/ThemeSwitch';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from '@/components/ui/toaster';
import MetaMaskProvider from '@/context/MetaMaskContext';
import type { Metadata } from 'next';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

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
          <MetaMaskProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ModeToggle />
              {children}
            </ThemeProvider>
          </MetaMaskProvider>
          <Toaster />
        </body>
      </html>
    </>
  )
}
