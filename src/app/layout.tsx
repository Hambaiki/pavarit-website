import "./globals.css";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Script from "next/script";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Pavarit's Website",
  description: "Discover more about Pavarit Wiriyakunakorn.",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script src="/register-sw.js" />
      <UserProvider>
        <body className={`${montserrat.className} transition-colors`}>
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
