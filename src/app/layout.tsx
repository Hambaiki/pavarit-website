import type { Metadata, Viewport } from "next";
import { Bai_Jamjuree } from "next/font/google";

import "./globals.css";

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://pavarit.com"
  ),
  title: "Pavarit's Website",
  description: "Discover more about Pavarit Wiriyakunakorn.",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    >
      <body className={`${baiJamjuree.variable} ${baiJamjuree.className}`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
