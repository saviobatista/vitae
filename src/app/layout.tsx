import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { NextIntlClientProvider } from "next-intl"; // Temporarily disabled
// import en from "@/i18n/messages/en.json"; // Temporarily disabled
import "./globals.css";
import { UploadProvider } from "@/app/lib/state/uploadContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VITAE",
  description: "Transform your résumé. Tailor your future.",
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UploadProvider>{children}</UploadProvider>
      </body>
    </html>
  );
}
