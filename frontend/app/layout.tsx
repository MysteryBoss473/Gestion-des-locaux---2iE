import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavbarWrapper from "../components/NavbarWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestion des locaux - 2iE",
  description: "Application de gestion des locaux de 2iE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavbarWrapper />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
