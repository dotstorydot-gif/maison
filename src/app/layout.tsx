import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const inter = Inter({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "Maison DE POUPÉE | Premium Beauty & Booking",
    template: "%s | Maison DE POUPÉE",
  },
  description: "Experience the dollhouse of elegance. Premium beauty services, skincare, and grooming in a luxurious setting. Book your appointment today.",
  keywords: ["beauty salon", "skincare", "hair styling", "nails", "lashes", "permanent makeup", "aesthetics", "London beauty"],
  authors: [{ name: "Maison DE POUPÉE" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://maisondepoupee.co.uk",
    title: "Maison DE POUPÉE | Premium Beauty & Booking",
    description: "Where beauty meets empowerment. Expert treatments for body, skin, hair, and more.",
    siteName: "Maison DE POUPÉE",
    images: [
      {
        url: "/10.jpg",
        width: 1200,
        height: 630,
        alt: "Maison DE POUPÉE Salon Interior",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison DE POUPÉE | Premium Beauty & Booking",
    description: "Where beauty meets empowerment. Expert treatments for body, skin, hair, and more.",
    images: ["/10.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${inter.variable} antialiased selection:bg-primary/30`}>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
