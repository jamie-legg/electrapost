import type { Metadata } from "next";
import { Comfortaa, Inter } from 'next/font/google'
import "./globals.css";
import { metadata as pageMetadata } from './metadata'; // adjust the path as needed
import { cn } from "./lib/utils";
import { Toaster } from "@/components/ui/toaster";


const fontHeading = Comfortaa({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

export const metadata: Metadata = pageMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
          <body 
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
