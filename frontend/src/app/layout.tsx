import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "AI Research Assistant | by vijayXcodes",
  description: "An intelligent, AI-powered research assistant to help you analyze, chat with, and extract insights from your PDF documents. Built by VIJAYXCODES.",
  keywords: ["AI", "Research", "Assistant", "PDF", "RAG", "LLM", "VIJAYXCODES", "OpenAI", "LangChain"],
  authors: [{ name: "vijayXcodes" }],
  creator: "vijayXcodes",
  openGraph: {
    title: "AI Research Assistant | by vijayXcodes",
    description: "Chat with your documents effortlessly using advanced RAG and AI.",
    siteName: "AI Research Assistant",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Research Assistant | by vijayXcodes",
    description: "Chat with your documents effortlessly using advanced RAG and AI.",
    creator: "@vijayXcodes",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
