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

const siteUrl = process.env.NEXTAUTH_URL || "https://messmatch.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MessMatch | The Marketplace for Campus & Corporate Dining",
    template: "%s | MessMatch",
  },
  description:
    "A modern platform connecting mess contractors with colleges, corporates, and institutions through transparent auctions and direct negotiations.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "MessMatch",
    title: "MessMatch | The Marketplace for Campus & Corporate Dining",
    description:
      "A modern platform connecting mess contractors with colleges, corporates, and institutions through transparent auctions and direct negotiations.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "MessMatch Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MessMatch | The Marketplace for Campus & Corporate Dining",
    description:
      "Connecting quality mess contractors with institutions for seamless catering solutions.",
    images: ["/logo.png"],
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
        <SessionProviderWrapper>
          <WebSocketProvider>
            <Header />
            {children}
            <Footer />
          </WebSocketProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
