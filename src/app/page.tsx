"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "./component/Navbar";
import PricingPlan from "./component/PricingPlan";
import Image from "next/image";
import Link from "next/link.js";
import { Icon } from "@iconify/react";
import Footer from "./component/Footer";
import { buildApiUrl } from "@/lib/api";
import { featureItems } from "./features/featureData";
import { useAuth } from "@/lib/useAuth";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function Home() {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById("plan-pricing");

    if (!pricingSection) return;

    pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // const features = [
  //   {
  //     title: "Auto-Discount Engine",
  //     description:
  //       "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
  //   },
  //   {
  //     title: "Auto-Discount Engine",
  //     description:
  //       "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
  //   },
  //   {
  //     title: "Auto-Discount Engine",
  //     description:
  //       "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
  //   },
  //   {
  //     title: "Auto-Discount Engine",
  //     description:
  //       "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
  //   },
  // ];

  const invoices = [
    {
      id: 1,
      src: "/invoice2.png",
      alt: "Professional invoice template",
    },
    {
      id: 2,
      src: "/invoice3.png",
      alt: "Modern GST invoice template",
    },
    {
      id: 3,
      src: "/invoice4.png",
      alt: "Business tax invoice template",
    },
    {
      id: 4,
      src: "/invoice5.png",
      alt: "Business tax invoice template",
    },
    {
      id: 5,
      src: "/invoice1.png",
      alt: "Business tax invoice template",
    },
  ];

  const [openId, setOpenId] = useState<number | null>(null);
  const { isLoggedIn, loading: authLoading } = useAuth();

  const FAQS = [
    {
      id: 1,
      question: "What is BissBill and who is it best for?",
      answer:
        "BissBill is an all-in-one GST billing software designed specifically for small businesses in India. Whether you're a retail shop owner, wholesaler, or a beginner with no accounting knowledge, BissBill makes it easy to create GST invoices, manage inventory, track payments, and generate reports — all from one simple platform. It is the best GST billing software for small business India that requires zero technical expertise to get started."
    },
    {
      id: 2,
      question: "Is BissBill really free? What features do I get for free?",
      answer: "Yes BissBill is free to start. When you sign up, you instantly get access to 45% of our core features including GST invoicing, basic inventory management, and payment tracking — with no credit card required and no hidden charges. It is one of the few free GST billing software options in India that actually gives you meaningful features without asking for payment upfront. You can upgrade anytime to unlock the full power of BissBill."
    },
    {
      id: 3,
      question: "Can BissBill replace Tally for my small business?",
      answer:
        "Absolutely. BissBill is built as a modern, easy-to-use Tally alternative billing software for India. Unlike Tally, BissBill requires no training or accounting background — your staff can start billing from day one. It covers everything a small business needs — GST invoicing, inventory tracking, purchase management, reports, and multi-user access all in one place. If you're looking for a simpler, faster, and more affordable online billing software India, BissBill is the right switch."
    },
    {
      id: 4,
      question: "Does BissBill support barcode scanning and WhatsApp invoice sharing?",
      answer:
        "Yes, both features are built right into BissBill. Our billing software with barcode scanner India support lets you scan products instantly at the counter for faster billing with zero manual entry errors. Once the invoice is ready, you can share it directly with your customer via WhatsApp, SMS, or Email in a single tap. BissBill is one of the very few billing software with WhatsApp invoice sharing available in India making it the perfect choice for retail shops and wholesalers who want fast, paperless billing.",
    },
    {
      id: 5,
      question: "Does BissBill work for retail shops and POS billing on PC or Windows?",
      answer:
        "Yes. BissBill is a complete POS billing software for retail shop India that works seamlessly on PC and Windows. Whether you run a grocery store, clothing shop, electronics store, or any other retail business, BissBill handles high-volume billing at the counter with speed and accuracy. It supports barcode scanners, thermal printers, and cash drawers making it the most reliable billing software for PC Windows India for retail owners who need a fast and dependable point-of-sale system.",
    },

  ];
  // testimonial slider code
  const settings = {
    dots: true,
    arrows: true, // ✅ correct
    infinite: true,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "0px",
    autoplay: true,
    speed: 700,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <main className="font-dm">
      <Navbar />
      {/* hero */}
      <section className="w-full bg-linear-to-t from-white via-blue-50 to-blue-50 ">
        <div className="max-w-7xl mx-auto px-4 py-10 text-center mt-px font-open">
          <div className="flex items-center justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-sm font-medium text-blue-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Smart Billing for Smart Business
            </span>
          </div>
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight ">
            India{`'`}s #1 GST Billing Software for <br />
            <span className="text-[#002DFF]">Smart Businesses</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-black font-open">
            Create GST invoices, manage inventory, track payments and automate
            reports everything your small business needs to bill smarter and
            grow faster.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-base">
            <Link href="/download">
              {" "}
              <button className="group relative p-px inline-flex items-center justify-center rounded-lg bg-linear-to-r from-[#3652D4] to-[#E4E9F7] transition-all hover:shadow-md cursor-pointer">
                {/* The Inner Layer */}
                <span className="px-6 py-3 rounded-[calc(0.5rem-1px)] bg-white text-black font-medium transition group-hover:bg-blue-50/80">
                  View Demo
                </span>
              </button>
            </Link>

            <button
              type="button"
              onClick={scrollToPricing}
              className="px-6 py-3 rounded-lg bg-[#0032FF] text-white font-medium hover:bg-blue-700 transition cursor-pointer"
            >
              Start Free Trial
            </button>
          </div>

          <div className="mt-16">
            <div className="w-full rounded-2xl overflow-hidden">
              <Image
                src="/HeroBilling.jpeg"
                alt="Billing Dashboard"
                width={1200}
                height={700}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* feature */}
      <section className="w-full bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto text-black">
            <h2 className="text-3xl md:text-[42px] font-bold font-open">
              Everything Your Business Needs to <br /> Bill Smarter
            </h2>
            <p className="mt-4 max-w-4xl text-base md:text-lg font-open">
              From GST invoicing to inventory, payments to analytics BissBill is
              the only GST billing software your business will ever need. Built
              for Indian small businesses, designed for simplicity.
            </p>
          </div>

          {/* View all */}
          <div className="mt-8 flex justify-end">
            <Link
              href="/features"
              className="  text-lg font-medium underline flex items-center gap-1"
            >
              View all{" "}
              <Icon icon="line-md:arrow-right" width="20" height="20" />
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureItems.slice(0, 4).map((item) => (
              <div
                key={item.slug}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition bg-white"
              >
                <h3 className="text-2xl font-semibold text-gray-900 font-open">
                  {item.title}
                </h3>

                <p className="mt-2 text-base">{item.cardDescription}</p>

                {/* Image Placeholder */}
                <Link
                  href={`/features-details?feature=${item.slug}`}
                  className="block mt-4 rounded-lg border border-gray-100 overflow-hidden"
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Invoice */}
      <section className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto text-black">
            <h2 className="text-3xl md:text-[42px] font-bold">Invoices</h2>
            <p className="mt-4 text-lg font-open">
              Create GST-ready invoices instantly, share them via WhatsApp or
              Email, and track every payment all from India{`'`}s easiest GST
              billing software.
            </p>
          </div>

          {/* Left Scroll Button (desktop only) */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="
        hidden md:flex
        absolute left-1 top-90 -translate-y-1/2
        z-10 w-10 h-10 rounded-full cursor-pointer
        bg-white shadow-lg
        items-center justify-center
        hover:bg-gray-100 transition
      "
          >
            <Icon icon="mingcute:left-line" width="22" height="22" />
          </button>

          {/* Right Scroll Button (desktop only) */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="
        hidden md:flex
        absolute right-1 top-90 -translate-y-1/2
        z-10 w-10 h-10 rounded-full
        bg-white shadow-lg
        items-center justify-center
        hover:bg-gray-100 transition
      "
          >
            <Icon icon="mingcute:right-line" width="22" height="22" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="
        mt-10
        flex gap-4 md:gap-6
        overflow-x-auto
        scroll-smooth
        no-scrollbar
        snap-x snap-mandatory
        pb-4
        px-2
      "
          >
            {invoices.map((item) => (
              <div
                key={item.id}
                className="
            snap-center
            min-w-65 sm:min-w-70 md:min-w-75
            bg-white border border-gray-200
            rounded-xl shadow-sm
            hover:shadow-md transition
          "
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={300}
                  height={420}
                  className="w-full h-auto rounded-xl"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* why choose us */}
      <section className="w-full bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Why Choose BissBill?
            </h2>
            <p className="mt-4 text-black text-base md:text-lg">
              More than just billing BissBill is a complete GST billing
              software built for Indian small businesses to invoice faster,
              manage smarter, and grow bigger.
            </p>
          </div>

          {/* Content Grid */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SIDE (Feature Cards) */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-[#F4F7FF] rounded-xl p-6">
                <div className="w-12 h-12  rounded-full border flex items-center justify-center mb-4">
                  <Icon icon="uit:rocket" width="28" height="28" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Business Growth
                </h3>
                <p className="mt-2 text-sm text-[#202020]">
                  BissBill is designed to grow with your business. From your
                  first invoice to managing multiple branches, our GST billing
                  software scales with every stage of your journey giving you
                  the tools to sell more, manage better, and earn more every
                  single day.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#F4F7FF] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full border flex items-center justify-center mb-4">
                  <Icon icon="uit:rocket" width="28" height="28" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Faster Payments
                </h3>
                <p className="mt-2 text-sm text-[#202020]">
                  Stop chasing payments manually. BissBill lets you share
                  invoices instantly via WhatsApp, SMS and Email, track
                  outstanding dues in real time, and send payment reminders in
                  one click so your cash flow stays healthy and collections stay
                  on track.
                </p>
              </div>

              {/* Card 3 (Full width) */}
              <div className="bg-[#F4F7FF] rounded-xl p-6 md:col-span-2">
                <div className="w-10 h-10 rounded-full border flex items-center justify-center mb-4">
                  <Icon icon="uit:rocket" width="28" height="28" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Real-Time Inventory
                </h3>
                <p className="mt-2 text-sm text-[#202020]">
                  Never run out of stock unexpectedly again. BissBill gives you
                  live inventory tracking, low stock alerts, barcode support,
                  and multi-warehouse management — all built into your billing
                  software with inventory management. Know exactly what you
                  have, where it is, and when to reorder.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE (CTA PANEL) */}
            <div className="bg-[#1D2D65] rounded-xl p-8 text-white flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center mb-6">
                  <Icon icon="uit:rocket" width="28" height="28" />
                </div>

                <h3 className="text-2xl font-medium leading-snug">
                  Free to Start 45% Features Included
                </h3>

                <p className="mt-4 text-sm text-[#E0E0E0]">
                  Getting started with BissBill costs you nothing. Sign up for
                  free and instantly unlock 45% of our powerful features —
                  including GST invoicing, inventory tracking, and payment
                  management. No credit card required, no hidden charges, no
                  risk.
                </p>

                <p className="mt-4 text-sm text-[#E0E0E0]">
                  Whether you{`'`}re a first-time business owner or switching
                  from a Tally alternative billing software, BissBill makes the
                  transition effortless. Try it free and see why thousands of
                  Indian small businesses trust BissBill as their
                  billing software.
                </p>
                <p className="mt-2 text-sm text-[#E0E0E0]">
                  Ready to bill smarter? Join India{`'`}s growing community of
                  smart business owners today.
                </p>
              </div>

              {!isLoggedIn && !authLoading && (
                <Link
                  href="/login"
                  className="mt-8 w-fit bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-sm font-medium"
                >
                  Log in / Sign up
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* pricing plan  */}
      <PricingPlan />

      {/* testimonial section*/}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-gray-600">
              Thousands of Indian small business owners trust BissBill as their
              go-to GST billing software — here{`'`}s what they have to say.
            </p>
          </div>

          {/* Cards */}
          <>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl bg-gray-100 p-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Icon
                      key={index}
                      icon="material-symbols:star"
                      width="24"
                      height="24"
                    />
                  ))}
                </div>
                <span className="text-gray-500">1 month ago</span>
              </div>

              <p className="mt-4 text-[#6F6D6D] text-base leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has Lorem Ipsum is simply dummy text of
                the printing and typesetting industry. Lorem Ipsum has
              </p>

              <div className="mt-6 flex items-center gap-3">
                <Image
                  src="/testimonial1.png"
                  alt="Customer profile photo"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-xl">Full Name</p>
                  <p className="text-base text-[#6F6D6D]">CEO of company</p>
                </div>
              </div>
            </div>

            {/* Card 2 (Highlighted) */}
            <div className="rounded-2xl bg-[#367AFF] p-6 text-white scale-[1.02]">
              <div className="flex items-center justify-between text-sm">
                <div className="flex ">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Icon
                      key={index}
                      icon="material-symbols:star"
                      width="24"
                      height="24"
                    />
                  ))}
                </div>
                <span className="text-blue-100">1 month ago</span>
              </div>

              <p className="mt-4 text-base leading-relaxed text-white">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has Lorem Ipsum is simply dummy text of
                the printing and typesetting industry. Lorem Ipsum has
              </p>

              <div className="mt-6 flex items-center gap-3">
                <Image
                  src="/testimonial2.png"
                  alt="Customer profile photo"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-xl">Full Name</p>
                  <p className="text-base ">CEO of company</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-gray-100 p-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex text-yellow-400">
                  {" "}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Icon
                      key={index}
                      icon="material-symbols:star"
                      width="24"
                      height="24"
                    />
                  ))}
                </div>
                <span className="text-gray-500">1 month ago</span>
              </div>

              <p className="mt-4 text-gray-600 text-base leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has Lorem Ipsum is simply dummy text of
                the printing and typesetting industry. Lorem Ipsum has
              </p>

              <div className="mt-6 flex items-center gap-3">
                <Image
                  src="/testimonial2.png"
                  alt="Customer profile photo"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold text-xl">Full Name</p>
                  <p className="text-base text-[#6F6D6D]">CEO of company</p>
                </div>
              </div>
            </div>
          </div>

            {/* ✅ Inbuilt CSS */}
            <style jsx global>{`
        .testimonial-card {
          transition: all 0.3s ease;
        }
        .slick-center .testimonial-card {
          background: #367AFF;
          transform: scale(1.05);
        }

        /* ⭐ FORCE white text */
        .slick-center .testimonial-card p,
        .slick-center .testimonial-card span,
        .slick-center .testimonial-card div {
          color: white !important;
        }
        .slick-center .testimonial-card {
          background: #367AFF;
          color: white;
          transform: scale(1.05);
        }

        .slick-slide {
          opacity: 0.6;
        }

        .slick-center {
          opacity: 1;
        }
          `}</style>
          </>

          {/* Rating Footer */}
          <div className="mt-16 flex flex-col items-center gap-3">
            {/* Stars */}
            <div className="flex text-blue-700 items-center  ">
              <h1 className="text-2xl font-medium text-black pr-1.5">
                Excellent Rating
              </h1>
              {Array.from({ length: 5 }).map((_, index) => (
                <Icon key={index} icon="mdi:star-box" width="30" height="30" />
              ))}
            </div>

            {/* Rating text */}
            <p className="text-base text-[#5A5A5A] flex items-center justify-center gap-2">
              <span className="text-black">
                <span className="font-semibold text-xl"> 4.8 </span>/ 5
              </span>

              <span>|</span>

              <span>Based on 2,300+ verified reviews</span>

              <span>|</span>

              <span className="flex items-center gap-1 text-yellow-400">
                <Icon icon="material-symbols:star" width={18} height={18} />
                <span className="text-[#5A5A5A]">Feedback</span>
              </span>
            </p>
          </div>
        </div>
      </section>

      {/*   FAQ Section */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-center">
            Frequently Asked Questions
          </h2>
          <p className="mt-4  text-gray-600 text-center">
            Everything you need to know about BissBill — India{`'`}s smartest
            GST billing software for small businesses.
          </p>
          {/* FAQ Items */}
          <div className="space-y-6 mt-4">
            {FAQS.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="border rounded-xl px-6 py-5 transition-all duration-300"
                >
                  {/* Question */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="font-semibold text-lg">
                      {faq.question}
                    </span>

                    <Icon
                      icon={isOpen ? "mdi:close" : "mdi:plus"}
                      width={20}
                      height={20}
                      className="text-gray-600 transition-transform duration-300"
                    />
                  </button>

                  {/* Answer Wrapper */}
                  <div
                    className={`
                    grid transition-all duration-500 ease-in-out
                    ${isOpen
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0 mt-0"
                      }
                  `}
                  >
                    <div className="overflow-hidden">
                      {/* Divider */}
                      <div
                        className={`
                        h-px bg-blue-500 mb-4
                        transition-all duration-500 ease-in-out
                        ${isOpen ? "scale-x-100" : "scale-x-0"}
                        origin-left
                      `}
                      />

                      {/* Answer */}
                      <p
                        className={`
                        text-gray-600 text-lg leading-relaxed
                        transition-all duration-500 ease-in-out
                        ${isOpen ? "translate-y-0" : "-translate-y-2"}
                      `}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* billing software Download  */}
      <section className="py-10 ">
        <div className="max-w-7xl mx-auto px-5 py-8 rounded-xl bg-[#EFF1F8]">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12  ">
            {/* Left Content */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                Ready to Make Billing Effortless?
              </h2>

              <p className="mt-4 text-gray-700 leading-relaxed max-w-xl">
                Create professional GST invoices, track payments, manage
                inventory, and monitor your business — all from one simple,
                secure billing platform. No stress, just smart billing built for
                growing businesses.
              </p>

              {!isLoggedIn && !authLoading ? (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 mt-6 bg-[#0032FF] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Start Free{" "}
                  <Icon icon="line-md:arrow-right" width="20" height="20" />
                </Link>
              ) : (
                <Link
                  href="#plan-pricing"
                  className="inline-flex items-center gap-1 mt-6 bg-[#0032FF] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Go to Pricing{" "}
                  <Icon icon="line-md:arrow-right" width="20" height="20" />
                </Link>
              )}
            </div>

            {/* Right Image */}
            <div className="flex-1 flex justify-center">
              <Image
                src="/billing-invoice.png"
                alt="Billing software dashboard preview"
                width={650}
                height={350}
                className="rounded-xl shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
