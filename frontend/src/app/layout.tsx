import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZuR Real Estate - Premium Properties",
  description: "Find your dream home with ZuR Real Estate. Professional real estate services with a personal touch. Houses, apartments, and commercial properties for sale and rent.",
  keywords: "real estate, properties, houses, apartments, buy, sell, rent, ZuR Real Estate",
  authors: [{ name: "ZuR Real Estate" }],
  creator: "ZuR Real Estate",
  openGraph: {
    title: "ZuR Real Estate - Premium Properties",
    description: "Find your dream home with ZuR Real Estate. Professional real estate services with a personal touch.",
    type: "website",
    siteName: "ZuR Real Estate",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
