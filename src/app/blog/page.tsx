"use client";

import Image from "next/image";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
// import { useEffect } from "react";

const blogs = [
  {
    id: 1,
    category: "UI/UX",
    title: "How to Design Clean UI Cards",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "/ourBlog.png",
    author: "Amit Sharma",
    avatar: "/testimonial1.png",
    date: "Dec 20, 2025",
  },
  {
    id: 2,
    category: "Blog",
    title: "How to Design Clean UI Cards",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "/windowDownload.png",
    author: "Amit Sharma",
    avatar: "/testimonial1.png",
    date: "Dec 20, 2025",
  },
  {
    id: 3,
    category: "Design",
    title: "How to Design Clean UI Cards",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "/ourBlog.png",
    author: "Amit Sharma",
    avatar: "/testimonial1.png",
    date: "Dec 20, 2025",
  },
  {
    id: 4,
    category: "Design",
    title: "How to Design Clean UI Cards",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "/windowDownload.png", 
    author: "Amit Sharma",
    avatar: "/testimonial1.png",
    date: "Dec 20, 2025",
  },
  {
    id: 5,
    category: "Design",
    title: "How to Design Clean UI Cards",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "/ourBlog.png",
    author: "Amit Sharma",
    avatar: "/testimonial1.png",
    date: "Dec 20, 2025",
  },
  {
    id: 6,
    category: "Design",
    title: "How to Design Clean UI Cards",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "/windowDownload.png",
    author: "Amit Sharma",
    avatar: "/testimonial1.png",
    date: "Dec 20, 2025",
  },
];

// useEffect(() => {
//   fetch("/api/blogs")
//     .then(res => res.json())
//     .then(setBlogs);
// }, []);

export default function BlogPage() {
  return (
    <main className="bg-[#F3F6FB] min-h-screen font-dm">
      <Navbar />

      {/* HERO */}
      <section className="pt-20 pb-14 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-black">Our Blog</h1>

        <p className="mt-4 max-w-5xl mx-auto text-black">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industrys standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled
        </p>

        {/* Search */}
        <div className="mt-8 flex max-w-md mx-auto">
          <input
            type="text"
            placeholder="Ask anything"
            className="flex-1 px-4 py-3 rounded-l-md border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-6 rounded-r-md hover:bg-blue-700 transition">
            Search
          </button>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />

                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-md">
                  {blog.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg text-black">
                  {blog.title}
                </h3>

                <p className="mt-2 text-gray-600 text-sm">{blog.description}</p>

                {/* Author */}
                <div className="mt-4 flex items-center gap-3">
                  <Image
                    src={blog.avatar}
                    alt={blog.author}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />

                  <div className="text-sm">
                    <p className="font-bold text-black">{blog.author}</p>
                    <p className="text-black">{blog.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* footer  */}
      <Footer/>
    </main>
  );
}
