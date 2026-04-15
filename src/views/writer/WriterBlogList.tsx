"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { buildApiUrl } from "@/lib/api";
import type { ContentStatus, WriterContentItem } from "@/types/writer";
import Image from "next/image";
const PAGE_SIZE = 10;

interface StatusBadgeProps {
  status?: ContentStatus | "scheduled";
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface ApiMessage {
  message?: string;
}

function resolveImageUrl(value?: string) {
  if (!value) return "";
  if (/^https?:\/\//.test(value) || value.startsWith("data:") || value.startsWith("blob:")) return value;
  return buildApiUrl(value);
}

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
      <span className="inline-flex items-center rounded-full bg-[#ede9fe] px-2.5 py-0.5 text-[11px] font-bold text-[#5b4ced]">
        Published
      </span>
    );
  }
  if (status === "scheduled") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#ede9fe] px-2.5 py-0.5 text-[11px] font-bold text-[#5b4ced]">
        Scheduled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[#f5f5f5] px-2.5 py-0.5 text-[11px] font-bold text-[#888]">
      Draft
    </span>
  );
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-12">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="text-sm font-medium text-[#9a9a9a] transition hover:text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
              page === p 
                ? "bg-[#5b4ced] text-white" 
                : "text-[#9a9a9a] hover:bg-[#fafaf8] hover:text-[#1a1a1a]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="text-sm font-medium text-[#9a9a9a] transition hover:text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <h3 className="text-xl font-bold text-[#1a1a1a] tracking-tight">No blogs yet</h3>
      <p className="mt-2 text-[#9a9a9a] max-w-xs mx-auto">Start writing your first post to reach your audience.</p>
      <Link
        href="/writer/blogs/create"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#5b4ced] text-white rounded-[10px] text-sm font-bold transition-all hover:bg-[#4a3ddb]"
      >
        <Icon icon="lucide:plus" width={16} />
        Write Blog
      </Link>
    </div>
  );
}

export default function WriterBlogList() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<WriterContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [page, setPage] = useState(1);

  async function loadBlogs(nextPage = 1) {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl(`/api/writer/blogs?page=${nextPage}&limit=${PAGE_SIZE}`), {
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Unable to load blogs");
      const data = await response.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load blogs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBlogs(page);
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(blogs.length / PAGE_SIZE));
  const paginatedBlogs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return blogs.slice(start, start + PAGE_SIZE);
  }, [blogs, page]);

  async function deleteBlog(id: string | number | undefined) {
    if (id === undefined) return;
    const confirmed = window.confirm("Delete this blog?");
    if (!confirmed) return;

    setDeletingId(id);
    const loadingToast = toast.loading("Deleting blog...");

    try {
      const response = await fetch(buildApiUrl(`/api/writer/blogs/${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      const data = (await response.json().catch(() => ({}))) as ApiMessage;
      if (!response.ok) throw new Error(data?.message || "Unable to delete blog");

      toast.dismiss(loadingToast);
      toast.success("Blog deleted");
      setBlogs((current) => {
        const nextBlogs = current.filter((blog) => blog.id !== id);
        const nextTotalPages = Math.max(1, Math.ceil(nextBlogs.length / PAGE_SIZE));
        setPage((currentPage) => Math.min(currentPage, nextTotalPages));
        return nextBlogs;
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : "Unable to delete blog");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 px-1">
        <div>
          <h2 className="text-[42px] font-bold tracking-[-0.03em] leading-tight text-[#1a1a1a]">Blogs</h2>
          <p className="mt-3 text-[17px] font-medium text-[#9a9a9a]">Manage and review your published blog posts.</p>
        </div>
        <Link
          href="/writer/blogs/create"
          className="inline-flex h-12 items-center gap-2.5 px-6 bg-[#5b4ced] text-white rounded-2xl text-sm font-bold transition-all hover:bg-[#4a3ecc] hover:shadow-[0_8px_20px_rgba(91,76,237,0.2)]"
        >
          <Icon icon="lucide:plus" width={18} />
          Write Blog
        </Link>
      </div>

      <section>
        {loading ? (
          <div className="py-32 text-center">
            <span className="text-sm font-medium text-[#9a9a9a]">Loading blogs...</span>
          </div>
        ) : !blogs.length ? (
          <EmptyState />
        ) : (
          <>
            <div className="rounded-3xl border border-[#ebebeb] bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#fafaf8] border-b border-[#ebebeb]">
                      <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#9a9a9a]">Image</th>
                      <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#9a9a9a]">Title</th>
                      <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#9a9a9a]">Category</th>
                      <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#9a9a9a]">Status</th>
                      <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#9a9a9a]">Date</th>
                      <th className="py-4 px-6 text-right text-[11px] font-bold uppercase tracking-widest text-[#9a9a9a]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f0]">
                    {paginatedBlogs.map((blog) => (
                      <tr key={blog.id} className="group hover:bg-[#fafaf8]/50 transition-colors">
                        <td className="py-4 px-6">
                          <Image
                            src={resolveImageUrl(blog.image)}
                            alt={blog.title || "Blog image"}
                            className="h-10 w-14 rounded-[10px] object-cover bg-[#f5f5f5] border border-[#ebebeb]"
                            width={56}
                            height={40}
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-[14px] font-semibold text-[#1a1a1a] line-clamp-1">{blog.title}</p>
                            <p className="mt-0.5 text-[11px] font-medium text-[#9a9a9a]">/{blog.slug}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[13px] font-medium text-[#3d3d3d]">
                          {blog.category}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={blog.status} />
                        </td>
                        <td className="py-4 px-6 text-[13px] font-medium text-[#3d3d3d]">
                          {formatDate(blog.updated_at)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end items-center gap-4">
                            <button
                              type="button"
                              onClick={() => router.push(`/writer/blogs/edit/${blog.id}`)}
                              className="text-[13px] font-bold text-[#5b4ced] hover:underline underline-offset-4"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteBlog(blog.id)}
                              disabled={deletingId === blog.id}
                              className="text-[13px] font-bold text-[#9a9a9a] transition hover:text-rose-500 disabled:opacity-50"
                            >
                              {deletingId === blog.id ? "..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
}

