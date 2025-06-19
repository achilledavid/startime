import "./globals.css";
import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/header";
import Providers from "./_trpc/providers";

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
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
