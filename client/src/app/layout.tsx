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
    "A modern platform connecting mess contractors with colleges, corporates, and institutions through transparent auctions, verified menu showcases, and direct negotiations.",
  keywords: [
    "campus dining",
    "mess contractor",
    "mess auction",
    "catering tenders",
    "college hostel mess",
    "corporate catering",
    "food service contract",
    "reverse auction catering",
    "messmatch",
  ],
  authors: [{ name: "MessMatch", url: siteUrl }],
  creator: "MessMatch",
  publisher: "MessMatch",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "MessMatch",
    title: "MessMatch | The Marketplace for Campus & Corporate Dining",
    description:
      "A modern platform connecting mess contractors with colleges, corporates, and institutions through transparent auctions, verified menu showcases, and direct negotiations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MessMatch Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MessMatch | The Marketplace for Campus & Corporate Dining",
    description:
      "Connecting quality mess contractors with institutions for seamless catering solutions through reverse auctions.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "MessMatch",
        description: "The Marketplace for Campus & Corporate Dining",
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "MessMatch",
        url: siteUrl,
        logo: `${siteUrl}/icon-512.png`,
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
