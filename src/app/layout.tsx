// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '@/styles/global.css'
import { cn } from "@/utils/tailwind-utils";
import { AuthProvider } from '@/providers/auth-provider'
import { Navbar } from '@/components/navigation/navbar'

// Font configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata
export const metadata: Metadata = {
  title: "Sri Lanka Bus Management System",
  description: "A comprehensive bus management platform for Sri Lankan operators",
  keywords: ["sri lanka", "bus", "management", "booking", "transport"],
  authors: [
    {
      name: "Bus Management Team",
      url: "https://srilankabusapp.com",
    },
  ],
};

// Root layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}