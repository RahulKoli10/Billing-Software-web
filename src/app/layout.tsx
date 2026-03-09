import type { Metadata } from "next";
import { DM_Sans, Open_Sans,Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; 

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Billow – Billing Software",
  description: "Modern billing software for businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${dmSans.variable} ${openSans.variable} antialiased`}>
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
