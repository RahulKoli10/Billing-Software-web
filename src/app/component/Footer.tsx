import Link from "next/link";
import { Icon } from "@iconify/react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#F3F6FB] pt-14">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-[#B1B1B1]">
          
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl">
            <Image
              src="/logo1.png"
              alt="logo"
              width={150}
              height={150}
              className="sm:w-full sm:h-auto"
            />
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4 text-gray-500">
            <Link href="https://x.com/"><Icon icon="ri:twitter-x-line" width={20} /></Link>
            <Link href="https://www.facebook.com/profile.php?id=61575774012675" target="_blank"><Icon icon="mdi:facebook" width={20} /></Link>
            <Link href="https://wa.me/"><Icon icon="mdi:whatsapp" width={20} /></Link>
            <Link href="https://www.instagram.com/bissbillofficial/" target="_blank"><Icon icon="mdi:instagram" width={20} /></Link>
            <Link href="https://www.linkedin.com/"><Icon icon="mdi:linkedin" width={20} /></Link>
            <Link href="https://t.me/"><Icon icon="mdi:telegram" width={20} /></Link>
            <Link href="https://www.youtube.com/"><Icon icon="mdi:youtube" width={20} /></Link>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-12 text-base text-[#5A5A5A]">

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-black mb-4 text-xl">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/download">Download</Link></li>
              <li><Link href="/help">Resources</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/news">News</Link></li>
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="font-medium text-black mb-4 text-xl">Popular Services</h4>
            <ul className="space-y-1">
              <li><Link href="/billing-software">GST Billing Software</Link></li>
              <li><Link href="/services/stock-management">Stock Management</Link></li>
              <li><Link href="/services/invoice-generator">Invoice Generator</Link></li>
              <li><Link href="/services/pos-billing-system">POS Billing System</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium text-black mb-4 text-xl">Company</h4>
            <ul className="space-y-1">
              <li><Link href="/help">Privacy Policy</Link></li>
              <li><Link href="/help">Terms & Conditions</Link></li>
              <li><Link href="/help">Refund Policy</Link></li>
              <li><Link href="/help">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium text-black mb-4 text-xl">Support</h4>
            <ul className="space-y-1">
              <li><Link href="/help">Contact Us</Link></li>
              <li><Link href="/help">Help & Support</Link></li>
              <li><Link href="/help">Video Tutorials</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <div className="hidden sm:block flex-1 h-px bg-gray-300"></div>

            <p className="text-xs sm:text-sm text-gray-600 text-center">
              © 2026 BissBill — A Product by NovaNectar Services Pvt. Ltd. All Rights Reserved.
            </p>

            <div className="hidden sm:block flex-1 h-px bg-gray-300"></div>
          </div>
        </div>

      </div>
    </footer>
  );
}