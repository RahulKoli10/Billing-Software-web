"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import NewsAssetImage from "../NewsAssetImage";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import { buildApiUrl } from "@/lib/api";

type NewsArticle = {
  id: number;
  slug: string;
  category: string;
  title: string;
  description: string;
  content: string;
  image: string;
  author: string;
  avatar: string;
  date: string;
  tags?: string;
  read_time?: string;
};

export default function NewsDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    const controller = new AbortController();

    async function fetchNewsArticle() {
      try {
        const res = await fetch(buildApiUrl(`/api/news/slug/${slug}`), {
          signal: controller.signal,
        });

        if (res.status === 404) {
          setNotFound(true);
          setArticle(null);
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await res.json();
        setArticle(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch news:", error);
          setArticle(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchNewsArticle();

    return () => controller.abort();
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#F3F6FB] font-dm">
      <Navbar />

      <section className="px-4 pt-20 pb-16">
        <div className="mx-auto max-w-5xl">
          <Link href="/news" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
            Back to news
          </Link>

          {loading ? (
            <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="h-72 w-full animate-pulse bg-gray-200 sm:h-96" />
              <div className="space-y-5 px-6 py-8 sm:px-10 sm:py-10">
                <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
                <div className="h-10 w-4/5 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
                <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
                  <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-4/6 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ) : notFound || !article ? (
            <div className="mt-8 rounded-3xl bg-white p-10 text-center text-gray-500 shadow-sm">
              News not found.
            </div>
          ) : (
            <article className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
  
  {/* Image Section (NO overlay) */}
  <div className="relative h-72 w-full sm:h-96">
    <NewsAssetImage
      src={article.image}
      alt={article.title}
      fill
      className="object-cover"
    />
  </div>

  {/* Content Section */}
  <div className="px-6 py-8 sm:px-10 sm:py-10">

    {/* Category */}
    <span className="inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
      {article.category}
    </span>

    {/* Title */}
    <h1 className="mt-4 max-w-6xl text-3xl font-bold tracking-tight text-black sm:text-4xl">
      {article.title}
    </h1>

    {/* Description */}
    <p className="mt-4 max-w-5xl text-sm text-gray-600 sm:text-base">
      {article.description}
    </p>

    {/* Author Section */}
    <div className="mt-6 flex items-center gap-3 border-b border-gray-100 pb-6">
     {article.avatar && article.avatar.trim() !== "" && (
  <NewsAssetImage
    src={article.avatar}
    alt={article.author}
    width={36}
    height={36}
    className="rounded-full"
  />
)}
      <div>
        <p className="font-bold text-gray-900">{article.author}</p>
        <p className="text-sm text-gray-500">
          {article.read_time ? `${article.read_time} - ${article.date}` : article.date}
        </p>

        {/* Tags */}
        {article.tags && (
          <div className="mt-2 flex flex-wrap gap-2">
            {String(article.tags)
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
              .map((tag, index) => {
                const colors = [
                  'from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200 hover:from-emerald-200 hover:to-teal-200',
                  'from-blue-100 to-indigo-100 text-blue-800 border-blue-200 hover:from-blue-200 hover:to-indigo-200', 
                  'from-purple-100 to-violet-100 text-purple-800 border-purple-200 hover:from-purple-200 hover:to-violet-200',
                  'from-pink-100 to-rose-100 text-pink-800 border-pink-200 hover:from-pink-200 hover:to-rose-200',
                  'from-orange-100 to-amber-100 text-orange-800 border-orange-200 hover:from-orange-200 hover:to-amber-200'
                ];
                const colorClass = colors[index % 5];
                return (
                  <span
                    key={tag}
                    className={`rounded-full bg-gradient-to-r ${colorClass} px-3 py-1 text-xs font-medium border hover:shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
                  >
                    {tag}
                  </span>
                );
              })}
          </div>
        )}
      </div>
    </div>

    {/* Content */}
    <div 
      className="prose prose-lg max-w-none mt-8"
      dangerouslySetInnerHTML={{ __html: article.content }}
    />

  </div>
</article>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
