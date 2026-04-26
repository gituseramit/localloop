import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "LocalLoop — Hyperlocal Service Marketplace",
    template: "%s | LocalLoop",
  },
  description:
    "India's hyperlocal marketplace for print, digital, and document services. Get printouts, scanning, resume help, and more — delivered to your door.",
  keywords: ["printout", "xerox", "scanning", "cyber cafe", "document services", "India", "hyperlocal", "marketplace"],
  openGraph: {
    title: "LocalLoop — Any Service. Near You. At Your Door.",
    description: "Hyperlocal marketplace for print, digital & document services across India.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{ style: { borderRadius: "12px" } }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
