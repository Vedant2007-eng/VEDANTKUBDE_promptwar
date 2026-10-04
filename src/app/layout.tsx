import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DecisionProvider } from "@/context/DecisionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BLINDSPOT AI — Think deeper. Decide better.",
  description: "An AI-powered thinking companion that reveals hidden assumptions, risks, and blind spots before you make critical decisions.",
  keywords: ["AI thinking companion", "decision making", "cognitive biases", "blind spots", "critical thinking"],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#050914",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050914] text-[#F8FAFC] selection:bg-purple-500/30 selection:text-white">
        <DecisionProvider>
          {children}
        </DecisionProvider>
      </body>
    </html>
  );
}
