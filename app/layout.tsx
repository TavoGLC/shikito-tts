import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "shikito-tts",
  description: "El modelo de síntesis de voz mas pequeño del mundo",

  openGraph: {
    title: 'shikito-tts',
    description: 'el sintetizador de voz más pequeño del mundo',
    url: 'https://shikito-tts.vercel.app',
    siteName: 'shikito-tts',
    images: [
      {
        url: 'https://shikito-tts.vercel.app/preview.png', // Must be an absolute URL
        width: 675,
        height: 450,
      }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'shikito-tts',
    description: 'el sintetizador de voz más pequeño del mundo',
    images: [{
      url: 'https://shikito-tts.vercel.app/preview.png', // Must be an absolute URL
      width: 675,
      height: 450,
    }]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
            {children}
            <Toaster />
        </div>
      </body>
    </html>
  );
}
