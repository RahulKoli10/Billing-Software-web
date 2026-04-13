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
          <div className="flex items-center gap-2 font-bold text-xl  ">
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
            <Link href={`https://x.com/`}>
              <Icon icon="ri:twitter-x-line" width={20} />{" "}
            </Link>
            <Link href={`https://www.facebook.com/profile.php?id=61575774012675`} target="_blank">
              <Icon icon="mdi:facebook" width={20} />
            </Link>
            <Link href={`https://wa.me/`}>
              <Icon icon="mdi:whatsapp" width={20} />
            </Link>
            <Link href={`https://www.instagram.com/bissbillofficial/`} target="_blank">
              <Icon icon="mdi:instagram" width={20} />
            </Link>
            <Link href={`https://www.linkedin.com/`}>
              <Icon icon="mdi:linkedin" width={20} />
            </Link>
            <Link href={`https://t.me/`}>
              <Icon icon="mdi:telegram" width={20} />
            </Link>
            <Link href={`https://www.youtube.com/`}>
              <Icon icon="mdi:youtube" width={20} />
            </Link>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-10 py-12 text-base text-[#5A5A5A]">
          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-black mb-4 text-xl">Quick Links</h4>
            <ul className="space-y-1 ">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/features">Features</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/download">Download</Link>
              </li>   
              <li>
                <Link href="/help">Resources</Link>
              </li>
              <li>
                <Link href="/help">FAQs</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/news">News</Link>
              </li>
              <li>
                <Link href="/help">About Us</Link>
              </li>
              <li>
                <Link href="/help">Help Centre</Link>
              </li>
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="font-medium text-black mb-4 text-xl">
              Popular Services
            </h4>
            <ul className="space-y-1 ">
              <li><Link href="/help">GST Billing Software</Link></li>
              <li><Link href="/help">QuickCharge Billing</Link></li>
              <li><Link href="/help">IGST Billing Software</Link></li>
              <li><Link href="/help">Stock Management</Link></li>
              <li><Link href="/help">Invoice Generator</Link></li>
              <li><Link href="/help">E-Invoice Software</Link></li>
              <li><Link href="/help">POS Billing System</Link></li>
              <li><Link href="/help">Free GST Billing Software</Link></li>
            </ul>
          </div>

          {/* Software */}
          <div>
            <h4 className="font-medium text-black mb-4 text-xl">Software</h4>
            <ul className="space-y-1">
              <li><Link href="/help">Accounting Software</Link></li>
              <li><Link href="/help">Inventory Management</Link></li>
              <li><Link href="/help">POS Billing Software</Link></li>
              <li><Link href="/help">E-Invoicing Software</Link></li>
              <li><Link href="/help">Retail Billing Software</Link></li>
              <li><Link href="/help">GST Invoice Software</Link></li> 
              <li><Link href="/help">Medical Billing</Link></li>
              <li><Link href="/help">Hotel Billing</Link></li>
            </ul>
          </div>

          {/* support */}
          <div>
            <h4 className="font-medium text-black mb-4 text-xl">Support</h4>
            <ul className="space-y-1 ">
               
              <li><Link href="/help">Contact Us</Link></li>
              <li><Link href="/help">Help & Support</Link></li>
              <li><Link href="/help">WhatsApp Helpdesh</Link></li>
              <li><Link href="/help">Video Tutorials</Link></li>
              <li><Link href="/help">Chat Support</Link></li>
              
            </ul>
          </div>

          {/* Compoany  */}
            <div>
            <h4 className="font-medium text-black mb-4 text-xl">Company</h4>
            <ul className="space-y-1">
              <li><Link href="/help">About</Link></li>
              <li><Link href="/help">Contact Us</Link></li>
              <li><Link href="/help">Privacy Policy</Link></li>
              <li><Link href="/help">Terms & Conditions</Link></li>
              <li><Link href="/help">Pricing Policy</Link></li>
              <li><Link href="/help">Refund Policy</Link></li>
              <li><Link href="/help">Cancellation Policy</Link></li>
              <li><Link href="/help">Cookie Policy</Link></li>
              <li><Link href="/help">Disclaimer</Link></li>
              <li><Link href="/help">Compliance Policy</Link></li>
            </ul>
          </div>
          {/* Resources */}
          <div>
            <h4 className="font-medium text-black mb-4 text-xl">Resources</h4>
            <ul className="space-y-1">
              <li><Link href="/help">Templates & Downloads</Link></li>
              <li><Link href="/help">Free Tools</Link></li>
              <li><Link href="/help">Videos & Demos</Link></li>
              <li><Link href="/help">Help & Support</Link></li>
              <li><Link href="/help">Security & Legal</Link></li>
              <li><Link href="/help">Updates & Knowledge</Link></li> 
              <li><Link href="/help">FAQs</Link></li>
            </ul>
          </div>

          {/* Guides  */}
            <div>
            <h4 className="font-medium text-black mb-4 text-xl">Company</h4>
            <ul className="space-y-1">
              <li><Link href="/help">Invoicing Guides</Link></li>
              <li><Link href="/help">Payments & Checkout</Link></li>
              <li><Link href="/help">Pricing & Subscription</Link></li>
              <li><Link href="/help">Inventory Management</Link></li>
              <li><Link href="/help">GST & Compliance</Link></li>
              <li><Link href="/help">Reports & Analytics</Link></li>
              <li><Link href="/help">Case Study</Link></li> 
            </ul>
          </div>
          {/* GST */}
          <div>
            <h4 className="font-medium text-black mb-4 text-xl">GST</h4>
            <ul className="space-y-1">
              <li><Link href="/">GST Basics</Link></li>
              <li><Link href="/">GST Registration </Link></li>
              <li><Link href="/">GST Returns</Link></li>
              <li><Link href="/">GST Payments & Refunds</Link></li>
              <li><Link href="/">GST Invoices & E-Invoicing</Link></li>
              <li><Link href="/">Input Tax Credit (ITC)</Link></li>
              <li><Link href="/">GST Penalties & Compliance</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <div className="hidden sm:block flex-1 h-px bg-gray-300"></div>

            <p className="text-xs sm:text-sm text-gray-600 whitespace-nowrap text-center">
             © 2026 BissBill — A Product by NovaNectar Services Pvt. Ltd. All Rights Reserved.
            </p>

            <div className="hidden sm:block flex-1 h-px bg-gray-300"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
