"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BlogAssetImage from "./BlogAssetImage";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { buildApiUrl } from "@/lib/api";

type Blog = {
  id: number;
  slug: string;
  category: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  author: string;
  avatar: string;
  date: string;
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBlogs() {
      try {
        const res = await fetch(buildApiUrl("/api/blogs"), {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch blogs:", error);
          setBlogs([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBlogs();

    return () => controller.abort();
  }, []);

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return blogs;
    }

    return blogs.filter((blog) =>
      [blog.category, blog.title, blog.description, blog.author]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [blogs, search]);

  return (
    <main className="bg-[#F3F6FB] min-h-screen font-dm">
      <Navbar />

      <section className="pt-20 pb-14 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-black">Our Blog</h1>

        <p className="mt-4 max-w-5xl mx-auto text-black">
          Explore long-form articles, product thinking, and practical guides in a
          dedicated reading experience built for complete blog posts.
        </p>

        <div className="mt-8 flex max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search blogs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-l-md border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-6 rounded-r-md hover:bg-blue-700 transition">
            Search
          </button>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {loading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`blog-skeleton-${index}`}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="h-48 animate-pulse bg-gray-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-4/5 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                      <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {filteredBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group"
            >
              <div className="relative h-48">
                <BlogAssetImage
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-md">
                  {blog.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg text-black">{blog.title}</h3>

                <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                  {blog.description}
                </p>

                <p className="mt-4 text-sm font-semibold text-blue-600">
                  Read full blog
                </p>

                <div className="mt-4 flex items-center gap-3">
                 {blog.avatar && blog.avatar.trim() !== "" && (
  <BlogAssetImage
    src={blog.avatar}
    alt={blog.author}
    width={36}
    height={36}
    className="rounded-full"
  />
)}

                  <div className="text-sm">
                    <p className="font-bold text-black">{blog.author}</p>
                    <p className="text-black">{blog.date}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {!loading && filteredBlogs.length === 0 && (
            <div className="col-span-full rounded-2xl border border-gray-200 bg-[#F3F6FB] px-6 py-12 text-center text-gray-500">
              No blogs matched your search.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
