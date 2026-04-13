import type { Metadata } from "next"; 
import "./globals.css";
import { DM_Sans, Open_Sans,Montserrat } from "next/font/google";
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

// export const metadata: Metadata = {
//   title: "BISSBILL",
//   description: "Modern billing software for businesses",
// };

export const metadata: Metadata = {
  title: "BissBill – GST Billing Software for Small Business India",
  description:
    "BissBill is the best free GST billing software for small business India. Create GST invoices, manage inventory, share bills on WhatsApp & more. Try free!",
  keywords: [
    "GST Billing Software",
    "Billing Software India",
    "GST Invoice Software",
    "Online Billing Software India",
    "Free GST Billing Software",
    "Billing Software with Inventory",
    "best GST billing software for small business India",
    "GST billing software with inventory management",
    "billing software with barcode scanner India",
    "billing software with WhatsApp invoice sharing",
    "billing software for PC Windows India",
    "POS billing software for retail shop India",
    "easy GST billing software for beginners",
    "Tally alternative billing software India",
  ],
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
