"use client";
import { useRef, useState } from "react";
import Navbar from "./component/Navbar";
import PricingPlan from "./component/PricingPlan";
import Image from "next/image";
import Link from "next/link.js";
import { Icon } from "@iconify/react";
import Footer from "./component/Footer";
import { buildApiUrl } from "@/lib/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function Home() {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById("plan-pricing");

    if (!pricingSection) return;

    pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const features = [
    {
      title: "Auto-Discount Engine",
      description:
        "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
        image:"/billing-invoices.png"
    },
    {
      title: "Auto-Discount Engine",
      description:
        "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
        image:"/gst-and-tax.png"
    },
    {
      title: "Auto-Discount Engine",
      description:
        "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
        image:"/inventory-managment.png"
    },
    {
      title: "Auto-Discount Engine",
      description:
        "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
        image:"/point-and-sales.png"
    },
  ];

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

  // slider code
  const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};
  const [openId, setOpenId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<null | { role: string }>(null);
  const checkAuth = async () => {
    try {
      const res = await fetch(buildApiUrl("/api/auth/me"), {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      const data = await res.json();
      setIsLoggedIn(data.authenticated === true);
      setUser(data.user ?? null);
    } catch {
      setIsLoggedIn(false);
      setUser(null); isLoggedIn
    } finally {
      setAuthChecked(true);
    }
  };
  const FAQS = [
    {
      id: 1,
      question: "Is the billing software really free to use?",
      answer:
        "Yes. Our billing software is fully GST-ready and supports GST invoices, tax calculations   and compliance reports as per Indian regulations. Yes. Our billing software is fully GST-ready and supports GST invoices, tax calculations   and compliance reports as per Indian regulations.",
    },
    {
      id: 2,
      question: " Is the billing software really free to use?",
      answer:
        "Yes. Our billing software is fully GST-ready and supports GST invoices, tax calculations   and compliance reports as per Indian regulations. Yes. Our billing software is fully GST-ready and supports GST invoices, tax calculations   and compliance reports as per Indian regulations.",
    },
    {
      id: 3,
      question: "Is the billing software really free to use?",
      answer:
        "Yes. Our billing software is fully GST-ready and supports GST invoices, tax calculations   and compliance reports as per Indian regulations. Yes. Our billing software is fully GST-ready and supports GST invoices, tax calculations   and compliance reports as per Indian regulations.",
    },
    {
      id: 4,
      question: " Is the billing software really free to use?",
      answer:
        "Yes. Our billing software is fully GST-ready and supports GST invoices, tax calculations   and compliance reports as per Indian regulations. Yes. Our billing software is fully GST-ready and supports GST invoices, tax calculations   and compliance reports as per Indian regulations.",
    },
  ];

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
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight ">
            All-In-One Billing That Grows <br />
            <span className="text-[#002DFF]">Your Business</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-black font-open">
            Create GST invoices manage inventory track payments and automate
            reports everything your business needs to bill smarter and faster
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
                src="/heroBilling.png"
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
              Features of our Invoice
            </h2>
            <p className="mt-4 text-base md:text-lg font-open">
              Everything you need to bill faster, manage better, and scale your
              business powered by automation, accuracy, and simplicity.
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
            {features.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition bg-white"
              >
                <h3 className="text-2xl font-semibold text-gray-900 font-open">
                  {item.title}
                </h3>

                <p className="mt-2 text-base  ">{item.description}</p>

                {/* Image Placeholder */}
                <div className="mt-4 rounded-lg border border-gray-100 overflow-hidden">
                  {/* <Image
                    src="/homeFeature.png"
                    alt="Feature"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  /> */}
                  <img src={item.image} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Invoice */}
      <section className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto text-black">
            <h2 className="text-3xl md:text-[42px] font-bold">Invoices</h2>
            <p className="mt-4 text-lg font-open">
              Send professional invoices, track payments, and reduce delays
              automatically.
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
              Why Choose Us
            </h2>
            <p className="mt-4 text-black text-base md:text-lg">
              Everything you need to create invoices, track payments, manage
              inventory, and run your business more efficiently from one
              platform.
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
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry{`'`}s
                  standard dummy text ever since the 1500s.
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
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry{`'`}s
                  standard dummy text ever since the 1500s.
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
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry{`'`}s
                  standard dummy text ever since the 1500s. It was popularised
                  in the 1960s with the release of Letraset sheets containing
                  Lorem Ipsum passages, and more recently with desktop
                  publishing software like Aldus PageMaker including versions of
                  Lorem Ipsum.
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
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry{`'`}s
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged.
                </p>

                <p className="mt-4 text-sm text-[#E0E0E0]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <p className="mt-2 text-sm text-[#E0E0E0]">
                  Lorem Ipsum has been the industry{`'`}s standard dummy text
                  ever since the 1500s.
                </p>
              </div>

              {isLoggedIn && (
                <Link
                  href="/signup"
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
              See how our billing solution helps businesses save time,
              streamline operations, and grow faster with an efficient billing
              system.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-5">
              <Slider {...settings}>

                {/* Card 1 */}
                <div className="p-10">
                  <div className="testimonial-card rounded-2xl bg-gray-100 p-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon key={i} icon="material-symbols:star" width="24" />
                        ))}
                      </div>
                      <span className="text-gray-900">1 month ago</span>
                    </div>

                    <p className="mt-4 text-gray-900">
                      Switching to BissBill saved us hours daily. Billing is super fast and inventory updates automatically.
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <Image src="/testimonial1.png" alt="" width={40} height={40} className="rounded-full" />
                      <div>
                        <p className="font-semibold text-xl">Ramesh Agarwal</p>
                        <p className="text-gray-900">
                          Owner, Agarwal General Store — Jaipur
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-10">
                  <div className="testimonial-card rounded-2xl bg-gray-100 p-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon key={i} icon="material-symbols:star" width="24" />
                        ))}
                      </div>
                      <span className="text-gray-900">1 month ago</span>
                    </div>

                    <p className="mt-4 text-gray-900">
                      WhatsApp invoice sharing is a game changer. Customers love instant bills and payments are easy to track.
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <Image src="/testimonial2.png" alt="" width={40} height={40} className="rounded-full" />
                      <div>
                        <p className="font-semibold text-xl">Priya Mehta</p>
                        <p className="text-gray-900">
                          Owner, Mehta Fashion House — Surat
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="p-10">
                  <div className="testimonial-card rounded-2xl bg-gray-100 p-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon key={i} icon="material-symbols:star" width="24" />
                        ))}
                      </div>
                      <span className="text-gray-900">1 month ago</span>
                    </div>

                    <p className="mt-4 text-gray-900">
                      Very simple and beginner friendly. Inventory alerts helped us avoid stock issues multiple times.
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <Image src="/testimonial2.png" alt="" width={40} height={40} className="rounded-full" />
                      <div>
                        <p className="font-semibold text-xl">Sunil Tiwari</p>
                        <p className="text-gray-900">
                          Owner, Tiwari Electronics — Lucknow
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="p-10">
                  <div className="testimonial-card rounded-2xl bg-gray-100 p-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon key={i} icon="material-symbols:star" width="24" />
                        ))}
                      </div>
                      <span className="text-gray-900">1 month ago</span>
                    </div>

                    <p className="mt-4 text-gray-900">
                      Easy to use software. My staff learned it quickly and billing errors are now zero.
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <Image src="/testimonial1.png" alt="" width={40} height={40} className="rounded-full" />
                      <div>
                        <p className="font-semibold text-xl">Amit Sharma</p>
                        <p className="text-gray-900">
                          Owner, Sharma Traders — <br /> Delhi
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </Slider>
            </div>

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
                <span className="font-semibold text-xl">7.2</span> / 10
              </span>

              <span>|</span>

              <span>Based on 43,403 verified reviews</span>

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
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          {/* FAQ Items */}
          <div className="space-y-6">
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

              {isLoggedIn ? (
                <Link
                  href="/signup"
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
