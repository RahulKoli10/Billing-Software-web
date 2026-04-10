"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, FileText, Newspaper, Sparkles, Plus } from "lucide-react";
import { buildApiUrl } from "@/lib/api";
import { useWriterAuth } from "@/context/WriterAuthContext";

const statIcons = {
  blogs: BookOpen,
  news: Newspaper,
  drafts: FileText,
};

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const isPublished = status === "published";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
        isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
      }`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

function TypeBadge({ type }) {
  const isBlog = type === "blog";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
        isBlog ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
      }`}
    >
      {isBlog ? <BookOpen className="h-3 w-3" /> : <Newspaper className="h-3 w-3" />}
      {isBlog ? "Blog" : "News"}
    </span>
  );
}

export default function WriterDashboard() {
  const { writer } = useWriterAuth();
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalNews: 0,
    drafts: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [blogsResponse, newsResponse] = await Promise.all([
          fetch(buildApiUrl("/api/writer/blogs"), {
            credentials: "include",
            cache: "no-store",
          }),
          fetch(buildApiUrl("/api/writer/news"), {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const blogs = blogsResponse.ok ? await blogsResponse.json() : [];
        const news = newsResponse.ok ? await newsResponse.json() : [];

        if (cancelled) {
          return;
        }

        const blogsData = Array.isArray(blogs) ? blogs : [];
        const newsData = Array.isArray(news) ? news : [];

        setStats({
          totalBlogs: blogsData.length,
          totalNews: newsData.length,
          drafts:
            blogsData.filter((item) => item?.status === "draft").length +
            newsData.filter((item) => item?.status === "draft").length,
        });

        const recentBlogs = blogsData.slice(0, 5).map(b => ({ ...b, itemType: "blog" }));
        const recentNews = newsData.slice(0, 5).map(n => ({ ...n, itemType: "news" }));

        const combined = [...recentBlogs, ...recentNews].sort((a, b) => {
          const dateA = new Date(a.created_at || a.date).getTime();
          const dateB = new Date(b.created_at || b.date).getTime();
          return dateB - dateA;
        });

        setRecentActivity(combined);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      key: "blogs",
      label: "Total Blogs",
      value: stats.totalBlogs,
      tone: "bg-[#efeaff] text-[#6a5ce8]",
    },
    {
      key: "news",
      label: "Total News",
      value: stats.totalNews,
      tone: "bg-[#f3efff] text-[#725ff0]",
    },
    {
      key: "drafts",
      label: "Drafts",
      value: stats.drafts,
      tone: "bg-[#f7f4ff] text-[#5f54c7]",
    },
  ];

  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-[#e8e4ff] bg-[radial-gradient(circle_at_top_right,_rgba(124,111,247,0.2),_transparent_30%),linear-gradient(135deg,#ffffff_0%,#f6f3ff_100%)] p-6 shadow-[0_30px_80px_-42px_rgba(124,111,247,0.5)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ddd8ff] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#7c6ff7]">
              <Sparkles className="h-3.5 w-3.5" />
              Writer Dashboard
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              {greeting}, {writer?.name || "Writer"}.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Keep an eye on your publishing pipeline here. You can review your content totals and track how many items are still waiting in draft.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = statIcons[card.key];

          return (
            <article
              key={card.key}
              className="rounded-[1.6rem] border border-[#e9e5ff] bg-white p-5 shadow-[0_26px_70px_-48px_rgba(124,111,247,0.55)]"
            >
              <div className={`inline-flex rounded-2xl p-3 ${card.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {loading ? "--" : card.value}
              </p>
            </article>
          );
        })}
      </section>

      <section className="flex flex-wrap gap-4">
        <Link
          href="/writer/blogs/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#7c6ff7] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#7c6ff7]/30 transition-all hover:-translate-y-0.5 hover:bg-[#6a5ce8] hover:shadow-[#7c6ff7]/40"
        >
          <Plus className="h-4 w-4" />
          Write New Blog
        </Link>
        <Link
          href="/writer/news/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#7c6ff7] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#7c6ff7]/30 transition-all hover:-translate-y-0.5 hover:bg-[#6a5ce8] hover:shadow-[#7c6ff7]/40"
        >
          <Plus className="h-4 w-4" />
          Write New Article
        </Link>
      </section>

      <section className="overflow-hidden rounded-[1.9rem] border border-[#ece8ff] bg-white shadow-[0_24px_70px_-54px_rgba(124,111,247,0.7)]">
        <div className="border-b border-[#ece8ff] bg-[#faf9ff] px-6 py-5">
           <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading recent activity...</div>
        ) : recentActivity.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No recent activity found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-[#ece8ff] bg-[#faf9ff]">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Type
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Title
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1edff]">
                {recentActivity.map((item, i) => (
                  <tr key={`${item.itemType}-${item.id}-${i}`} className="hover:bg-[#fcfbff]">
                    <td className="px-6 py-4">
                      <TypeBadge type={item.itemType} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-950 line-clamp-1">{item.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(item.date || item.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
