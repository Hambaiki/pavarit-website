import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Montserrat, Sarabun, Prompt } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const montserrat = Montserrat({
  subsets: ["latin"],
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
      className="scrollbar scrollbar-thumb-neutral-700 scrollbar-track-neutral-800"
    >
      <UserProvider>
        <body className={`${montserrat.className}`}>{children}</body>
      </UserProvider>
    </html>
  );
}
