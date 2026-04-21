import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Icon } from "@iconify/react";

export default function TestimonialSlider() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: isMobile ? "20px" : "0px",
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  const cards = [
    {
      bg: "bg-gray-100",
      text: "We were using a manual register for years and switching to BillBiss was the best decision we made. GST invoices are ready in seconds, stock is always updated, and my staff learned it in a single day. Highly recommend it to every shop owner in India",
      img: "/testimonial1.png",
      name: "Ramesh Agarwal",
      title: "Owner, Agarwal General Store — Jaipur"
    },
    {
      bg: "bg-[#367AFF] text-white scale-[1.02]",
      text: "BillBiss completely changed how we run our retail business. Earlier we were spending hours on billing and GST calculations — now it takes minutes. The WhatsApp invoice sharing feature is a game changer. Our customers love getting instant bills and we love how easy it is to track payments.",
      img: "/testimonial2.png",
      name: "Priya Mehta Designation",
      title: "Owner, Mehta Fashion House — Surat"
    },
    {
      bg: "bg-gray-100",
      text: "I tried multiple billing software before BillBiss but they were all too complicated. This one is simple, fast, and perfect for someone with no accounting background. The inventory tracking and low stock alerts have saved us so many times. Best GST billing software for small business in India.",
      img: "/testimonial1.png",
      name: "Sunil Tiwari",
      title: "Owner, Tiwari Electronics — Lucknow"
    },
    {
      bg: "bg-gray-100",
      text: "BillBiss ne hamare business ko kaafi simplify kar diya hai. Pehle daily sales aur stock manage karna bahut hectic tha, lekin ab sab kuch ek hi jagah easily track ho jata hai. Reports clear hain, GST filing easy ho gayi hai, aur overall kaam kaafi fast ho gaya hai.",
      img: "/testimonial4.png",
      name: "Amit Sharma",
      title: "Owner, Sharma Kirana Store — Delhi"
    }
  ];

  return (
    <section className="py-16 bg-[#f9fafb] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Thousands of Indian small business owners trust BillBiss as their go-to GST billing software — here's what they have to say.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <Slider {...settings}>
          {cards.map((card, i) => (
            <div key={i} className="px-4 py-10">
              <div className="testimonial-card flex flex-col justify-between lg:p-8 p-3 rounded-2xl shadow-lg border border-gray-100 transition-all duration-500">
                <div>
                  <div className="flex gap-1 mb-5 rating-stars">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Icon
                        key={index}
                        icon="material-symbols:star"
                        width="22"
                        className="star-icon text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed testimonial-text italic">
                    "{card.text}"
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <img
                    src={card.img}
                    alt={card.name}
                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  />
                  <div className="text-left">
                    <p className="font-bold user-name">{card.name}</p>
                    <p className="text-sm user-title opacity-80">{card.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
                /* Container and Track */
                .slick-list { overflow: visible !important; }
                .slick-track { display: flex !important; align-items: center; }
                
                /* Default Card Style (White) */
                .testimonial-card {
                    background: white;
                    min-height: 280px;
                    transform: scale(0.9);
                    opacity: 0.6;
                }
                .testimonial-text { color: #4b5563; }
                .user-name { color: #111827; }
                .user-title { color: #6b7280; }

                /* Active/Center Card Style (Blue) */
                .slick-center .testimonial-card, 
                .slick-current .testimonial-card {
                    background: linear-gradient(180deg, #2563eb 0%, #1e40af 100%);
                    color: white;
                    transform: scale(1.05);
                    opacity: 1;
                    border: none;
                }

                .slick-center .testimonial-text,
                .slick-center .user-name,
                .slick-center .user-title,
                .slick-center .star-icon {
                    color: white !important;
                }

                /* Dots Styling */
                .slick-dots { bottom: -40px; }
                .slick-dots li button:before { font-size: 10px; color: #cbd5e1; opacity: 1; }
                .slick-dots li.slick-active button:before { color: #2563eb; }

                @media (max-width: 768px) {
                    .testimonial-card { transform: scale(1); opacity: 1; }
                }
            `}</style>
    </section>
  );
}