import "./globals.css";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const montserrat = Montserrat({
  subsets: ["latin"],
  // weight: ["400", "500", "700"],
});

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
    <html lang="en" className="scrollbar scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
      <UserProvider>
        <body
          className={`${montserrat.className} transition-colors`}
        >
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
