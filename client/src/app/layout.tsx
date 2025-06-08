import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProviderWrapper from "./providers/SessionProviders";
import { WebSocketProvider } from "@/context/WebSocketContext";
import Header from "./components/General/Header";
import Footer from "./components/General/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mess Bazaar",
  description:
    "A modern we application connecting mess contractors with collegs, corporates and institutions.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebSocketProvider>
          <SessionProviderWrapper>
            <Header />
            {children}
            <Footer />
          </SessionProviderWrapper>
        </WebSocketProvider>
      </body>
    </html>
  );
}
