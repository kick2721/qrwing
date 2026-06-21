import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LangProvider } from "@/context/LangContext";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QRWing — Professional QR Code Generator",
  description:
    "Create free QR codes with custom colors and logo. Dynamic QR codes with analytics for professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <SessionProvider>
          <LangProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </LangProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
