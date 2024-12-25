import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Bai_Jamjuree } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
};

export const metadata: Metadata = {
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
      className="scrollbar scrollbar-thumb-gray-800 scrollbar-track-gray-850"
    >
      <UserProvider>
        <body className={`${baiJamjuree.className}`}>{children}</body>
      </UserProvider>
    </html>
  );
}
