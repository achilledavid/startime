import "./globals.css";
import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./_trpc/providers";
import { Toaster } from "sonner";
import { NuqsAdapter } from 'nuqs/adapters/next/app'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Startime",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NuqsAdapter>
          <Providers>
            {children}
          </Providers>
        </NuqsAdapter>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
