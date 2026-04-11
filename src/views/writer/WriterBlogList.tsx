"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronLeft, ChevronRight, LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { buildApiUrl } from "@/lib/api";
import type { ContentStatus, WriterContentItem } from "@/types/writer";

const PAGE_SIZE = 10;

interface StatusBadgeProps {
  status?: ContentStatus;
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
  if (!value) {
    return "";
  }

  if (/^https?:\/\//.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  return buildApiUrl(value);
}

function formatDate(value?: string) {
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

function StatusBadge({ status }: StatusBadgeProps) {
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

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-[#ece8ff] px-6 py-4">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="inline-flex items-center gap-2 rounded-xl border border-[#ddd7ff] px-3 py-2 text-sm font-medium text-[#6a5ce8] transition hover:bg-[#f4f1ff] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="inline-flex items-center gap-2 rounded-xl border border-[#ddd7ff] px-3 py-2 text-sm font-medium text-[#6a5ce8] transition hover:bg-[#f4f1ff] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f1efff] text-[#6a5ce8]">
        <BookOpen className="h-10 w-10" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-950">No blogs yet. Create your first post.</h3>
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

      if (!response.ok) {
        throw new Error("Unable to load blogs");
      }

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
    if (id === undefined) {
      return;
    }
    const confirmed = window.confirm("Delete this blog?");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(buildApiUrl(`/api/writer/blogs/${id}`), {
        method: "DELETE",
        credentials: "include",
      });

      const data = (await response.json().catch(() => ({}))) as ApiMessage;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to delete blog");
      }

      toast.success("Blog deleted");

      setBlogs((current) => {
        const nextBlogs = current.filter((blog) => blog.id !== id);
        const nextTotalPages = Math.max(1, Math.ceil(nextBlogs.length / PAGE_SIZE));
        setPage((currentPage) => Math.min(currentPage, nextTotalPages));
        return nextBlogs;
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete blog");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#e7e2ff]">
        <div className="flex items-center gap-8 overflow-x-auto">
          <Link
            href="/writer/blogs/create"
            className="pb-3 text-sm font-medium text-slate-500 transition hover:text-[#534AB7]"
          >
            Create Blog
          </Link>
          <span className="border-b-2 border-[#7c6ff7] pb-3 text-sm font-semibold text-[#534AB7]">
            View Blogs
          </span>
        </div>
      </div>

      <section className="overflow-hidden rounded-[1.9rem] border border-[#ece8ff] bg-white shadow-[0_24px_70px_-54px_rgba(124,111,247,0.7)]">
        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-[#ece8ff] bg-[#faf9ff] px-5 py-4 text-sm font-medium text-slate-600">
              <LoaderCircle className="h-4 w-4 animate-spin text-[#7c6ff7]" />
              Loading blogs...
            </div>
          </div>
        ) : !blogs.length ? (
          <EmptyState />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-[#ece8ff] bg-[#faf9ff]">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Featured Image
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Title
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Categories
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1edff]">
                  {paginatedBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-[#fcfbff]">
                      <td className="px-6 py-5">
                        <img
                          src={resolveImageUrl(blog.image)}
                          alt={blog.title}
                          className="h-14 w-20 rounded-xl object-cover"
                        />
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{blog.title}</p>
                          <p className="mt-1 text-xs text-slate-500">/{blog.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex rounded-full bg-[#EEEDFE] px-3 py-1 text-xs font-medium text-[#534AB7]">
                            {blog.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={blog.status} />
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {formatDate(blog.date || blog.created_at)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => router.push(`/writer/blogs/edit/${blog.id}`)}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#ddd7ff] px-3 py-2 text-sm font-medium text-[#6a5ce8] transition hover:bg-[#f4f1ff]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBlog(blog.id)}
                            disabled={deletingId === blog.id}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                          >
                            <Trash2 className="h-4 w-4" />
                            {deletingId === blog.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
}

