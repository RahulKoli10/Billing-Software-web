"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { buildApiUrl } from "@/lib/api";
import { useWriterAuth } from "@/context/WriterAuthContext";
import type { ContentStatus, DashboardStats, WriterContentItem } from "@/types/writer";

interface StatusBadgeProps {
  status?: ContentStatus;
}

interface TypeBadgeProps {
  type?: "blog" | "news" | string;
}

type ActivityItem = WriterContentItem & {
  itemType: "blog" | "news";
};

function formatDate(value?: string) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#f0fdf4] px-2.5 py-0.5 text-xs font-medium text-[#16a34a]">
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[#f5f5f5] px-2.5 py-0.5 text-xs font-medium text-[#666]">
      Draft
    </span>
  );
}

function TypeBadge({ type }: TypeBadgeProps) {
  const isBlog = type === "blog";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#3d3d3d] capitalize">
      <Icon 
        icon={isBlog ? "lucide:book-open" : "lucide:newspaper"} 
        width={14} 
        className="text-[#9a9a9a]" 
      />
      {isBlog ? "Blog" : "News"}
    </span>
  );
}

export default function WriterDashboard() {
  const { writer } = useWriterAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    totalNews: 0,
    drafts: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
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

        if (cancelled) return;

        const blogsData = Array.isArray(blogs) ? blogs : [];
        const newsData = Array.isArray(news) ? news : [];

        setStats({
          totalBlogs: blogsData.length,
          totalNews: newsData.length,
          drafts:
            blogsData.filter((item) => item?.status === "draft").length +
            newsData.filter((item) => item?.status === "draft").length,
        });

        const recentBlogs = blogsData.slice(0, 5).map((b) => ({ ...b, itemType: "blog" as const }));
        const recentNews = newsData.slice(0, 5).map((n) => ({ ...n, itemType: "news" as const }));

        const combined = [...recentBlogs, ...recentNews].sort((a, b) => {
          const dateA = new Date(a.created_at || a.date).getTime();
          const dateB = new Date(b.created_at || b.date).getTime();
          return dateB - dateA;
        });

        setRecentActivity(combined);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadData();
    return () => { cancelled = true; };
  }, []);

  const cards = [
    { label: "Total Blogs", value: stats.totalBlogs },
    { label: "Total News", value: stats.totalNews },
    { label: "Drafts", value: stats.drafts },
  ];

  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-[42px] font-bold tracking-[-0.06em] leading-tight text-[#1a1a1a]">
          {greeting}, <span className="text-[#5b4ced] ">{writer?.name?.split(" ")[0] || "Writer"}</span>.
        </h2>
        <p className="mt-3 text-[17px] font-medium text-[#9a9a9a] max-w-2xl">
          Here&apos;s an overview of your content performance today.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.label}
            className="group bg-white border border-[#ebebeb] rounded-3xl p-8 transition-all hover:border-[#5b4ced]/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <p className="text-[12px] font-bold text-[#9a9a9a] uppercase tracking-widest">
              {card.label}
            </p>
            <p className="mt-4 text-[42px] font-bold tracking-tight text-[#1a1a1a]">
              {loading ? "--" : card.value}
            </p>
          </article>
        ))}
      </section>

      <section className="flex flex-wrap gap-4">
        <Link
          href="/writer/blogs/create"
          className="inline-flex h-12 items-center gap-2.5 px-6 border border-[#ebebeb] bg-white rounded-2xl text-sm font-bold text-[#1a1a1a] transition-all hover:bg-[#fafaf8] hover:border-[#5b4ced] hover:text-[#5b4ced]"
        >
          <Icon icon="lucide:plus" width={18} />
          Write Blog
        </Link>
        <Link
          href="/writer/news/create"
          className="inline-flex h-12 items-center gap-2.5 px-6 border border-[#ebebeb] bg-white rounded-2xl text-sm font-bold text-[#1a1a1a] transition-all hover:bg-[#fafaf8] hover:border-[#5b4ced] hover:text-[#5b4ced]"
        >
          <Icon icon="lucide:plus" width={18} />
          Write News Article
        </Link>
      </section>

      <section className="pt-4">
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-[19px] font-bold tracking-tight text-[#1a1a1a]">Recent Activity</h3>
        </div>
        
        <div className="rounded-3xl border border-[#ebebeb] bg-white overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-sm font-medium text-[#9a9a9a]">Loading recent activity...</div>
          ) : recentActivity.length === 0 ? (
            <div className="py-20 text-center text-sm font-medium text-[#9a9a9a]">No recent activity found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fafaf8] border-b border-[#ebebeb]">
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#9a9a9a]">Type</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#9a9a9a]">Title</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#9a9a9a]">Status</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#9a9a9a]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f0]">
                  {recentActivity.map((item, i) => (
                    <tr key={`${item.itemType}-${item.id}-${i}`} className="group hover:bg-[#fafaf8]/50 transition-colors">
                      <td className="py-4 px-6">
                        <TypeBadge type={item.itemType} />
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[14px] font-semibold text-[#1a1a1a] line-clamp-1">{item.title}</p>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-4 px-6 text-[13px] font-medium text-[#3d3d3d]">
                        {formatDate(item.date || item.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

