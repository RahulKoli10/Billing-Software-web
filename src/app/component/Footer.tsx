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
                <Link href="/">Resources</Link>
              </li>
              <li>
                <Link href="/">FAQs</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/news">News</Link>
              </li>
              <li>
                <Link href="/">About Us</Link>
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
              <li>TaxFlow System</li>
              <li>QuickCharge Billing</li>
              <li>LedgerSmart</li>
              <li>StockPilot</li>
              <li>Invoicely Core</li>
              <li>Invoice</li>
              <li>E-Invoice</li>
            </ul>
          </div>

          {/* Software */}
          {/* <div>
            <h4 className="font-medium text-black mb-4 text-xl">Software</h4>
            <ul className="space-y-1">
              <li>Accounting Software</li>
              <li>Inventory Management</li>
              <li>POS Billing Software</li>
              <li>e-Invoicing Software</li>
              <li>Retail Billing Software</li>
              <li>Invoice  </li>
              <li>E-Invoice  </li>
              <li>Medical Billing</li>
              <li>Hotel Billing</li>
            </ul>
          </div> */}

          {/* support */}
          <div>
            <h4 className="font-medium text-black mb-4 text-xl">Support</h4>
            <ul className="space-y-1 ">
               
              <li><Link href="/help">Contact Us</Link></li>
              <li><Link href="/help">Help & Support</Link></li>
              
            </ul>
          </div>

          {/* Compoany  */}
            <div>
            <h4 className="font-medium text-black mb-4 text-xl">Company</h4>
            <ul className="space-y-1">
              <li>About</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Pricing Policy</li>
              <li>Refund Policy</li>
              <li>Cancellation Policy</li>
              <li>Cookie Policy</li>
              <li>Disclaimer</li>
              <li>Compliance Policy</li>
            </ul>
          </div>
          {/* Resources */}
          <div>
            <h4 className="font-medium text-black mb-4 text-xl">Resources</h4>
            <ul className="space-y-1">
              <li>Templates & Downloads</li>
              <li>Free Tools</li>
              <li>Videos & Demos</li>
              <li>Help & Support</li>
              <li>Security & Legal</li>
              <li>Updates & Knowledge</li>
              {/* <li>Blog</li> */}
              {/* <li>FAQs</li> */}
            </ul>
          </div>

          {/* Guides  */}
            <div>
            <h4 className="font-medium text-black mb-4 text-xl">Company</h4>
            <ul className="space-y-1">
              <li>Invoicing Guides</li>
              <li>Payments & Checkout</li>
              <li>Pricing & Subscription</li>
              <li>Inventory Management</li>
              <li>GST & Compliance</li>
              <li>Reports & Analytics</li>
              <li>Case Study</li> 
            </ul>
          </div>
          {/* GST */}
          {/* <div>
            <h4 className="font-medium text-black mb-4 text-xl">GST</h4>
            <ul className="space-y-1">
              <li>GST Basics</li>
              <li>GST Registration</li>
              <li>GST Returns</li>
              <li>GST Payments & Refunds</li>
              <li>GST Invoices & E-Invoicing</li>
              <li>Input Tax Credit (ITC)</li>
              <li>GST Penalties & Compliance</li>
            </ul>
          </div> */}
        </div>

        {/* Bottom bar */}
        <div className="mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <div className="hidden sm:block flex-1 h-px bg-gray-300"></div>

            <p className="text-xs sm:text-sm text-gray-600 whitespace-nowrap text-center">
              © 2025 H.A.K GROUP. All rights reserved.
            </p>

            <div className="hidden sm:block flex-1 h-px bg-gray-300"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
