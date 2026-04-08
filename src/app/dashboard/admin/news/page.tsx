"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buildApiUrl } from "@/lib/api";
import { Badge, Button, Card } from "@/components/ui/atoms";
import {
  Edit2,
  Eye,
  EyeOff,
  ExternalLink,
  Plus,
  Search,
  Trash2,
  X,
  Newspaper,
  Tag,
  Clock,
} from "lucide-react";

// ─── Types ---

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
  tags: string;           // comma-separated e.g. "ai,tech news,india"
  read_time: string;      // e.g. "4 min read"
  is_active: boolean;
};

const emptyForm = {
  slug: "",
  category: "",
  title: "",
  description: "",
  content: "",
  image: "",
  author: "",
  avatar: "",
  date: "",
  tags: "",
  read_time: "",
};

// ─── Helpers ─

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Rough estimate: 200 words per minute */
function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

const NEWS_CATEGORIES = [
  "Technology",
  "AI & Machine Learning",
  "Business",
  "Startups",
  "Cybersecurity",
  "Finance",
  "Health Tech",
  "Policy",
];

// ─── Component ───────────

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // ── Data fetching ──────

  const fetchArticles = async () => {
    try {
      setError(null);
      const res = await fetch(buildApiUrl("/api/news/admin"), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch news articles");
      const data = await res.json();
      setArticles(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  useEffect(() => {
    void fetchArticles();
  }, []);

  // ── Form helpers ───────

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setAvatarFile(null);
  };

  const handleChange =
    (field: keyof typeof emptyForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((current) => {
        // Auto-slug from title when creating new
        if (field === "title" && !editingId && !current.slug.trim()) {
          return { ...current, title: value, slug: slugify(value) };
        }
        if (field === "slug") {
          return { ...current, slug: slugify(value) };
        }
        // Auto read_time from content
        if (field === "content") {
          return {
            ...current,
            content: value,
            read_time: current.read_time || estimateReadTime(value),
          };
        }
        return { ...current, [field]: value };
      });
    };

  // ── CRUD - 

  const submitArticle = async (e?: FormEvent) => {
    e?.preventDefault();

    if (
      !form.category ||
      !form.title ||
      !form.slug ||
      !form.description ||
      !form.content ||
      !form.author ||
      (!form.image && !imageFile)
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = editingId
        ? buildApiUrl(`/api/news/${editingId}`)
        : buildApiUrl("/api/news");

      const payload = new FormData();
      payload.append("slug", slugify(form.slug || form.title));
      payload.append("category", form.category);
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("content", form.content);
      payload.append("author", form.author);
      payload.append("tags", form.tags);
      payload.append(
        "read_time",
        form.read_time || estimateReadTime(form.content)
      );
      payload.append(
        "date",
        form.date ||
          new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
      );
      payload.append("image", form.image);
      payload.append("avatar", form.avatar);

      if (imageFile) payload.append("imageFile", imageFile);
      if (avatarFile) payload.append("avatarFile", avatarFile);

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        body: payload,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to save article");
      }

      resetForm();
      await fetchArticles();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  const editArticle = (article: NewsArticle) => {
    setEditingId(article.id);
    setForm({
      slug: article.slug,
      category: article.category,
      title: article.title,
      description: article.description,
      content: article.content,
      image: article.image,
      author: article.author,
      avatar: article.avatar,
      date: article.date,
      tags: article.tags,
      read_time: article.read_time,
    });
    setImageFile(null);
    setAvatarFile(null);
    document.getElementById("news-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const deleteArticle = async (id: number) => {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl(`/api/news/${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to delete article");
      }
      await fetchArticles();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete article");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number, isActive: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl(`/api/news/${id}/status`), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to update status");
      }
      await fetchArticles();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  // ── Filtering ──────────

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesSearch =
        !query ||
        [a.title, a.slug, a.category, a.author, a.tags]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesCategory =
        !filterCategory || a.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, search, filterCategory]);

  const activeCount = articles.filter((a) => a.is_active).length;

  // ── Render ─

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold font-headline text-gray-900 tracking-tighter sm:text-3xl">
            News Room
          </h2>
          <p className="text-gray-500 font-medium">
            Publish and manage news articles with tags, categories, and read time.
          </p>
        </div>
        <Button
          size="sm"
          className="flex items-center gap-2 self-start sm:self-auto"
          onClick={() => {
            resetForm();
            document.getElementById("news-form")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Plus className="w-4 h-4" />
          New Article
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Articles", value: articles.length, icon: Newspaper },
          { label: "Published", value: activeCount, icon: Eye },
          { label: "Hidden", value: articles.length - activeCount, icon: EyeOff },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center justify-between font-medium text-sm">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* ── Table ─── */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card className="overflow-hidden p-0">
            <div className="flex flex-col gap-3 border-b border-gray-100 bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold font-headline text-lg">Articles</h3>
                <span className="text-xs text-gray-400 font-medium">
                  {filteredArticles.length} of {articles.length}
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search title, tag, author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                {/* Category filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="rounded-lg bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600/20 text-gray-600 font-medium"
                >
                  <option value="">All categories</option>
                  {NEWS_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[680px] w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    {["ID", "Article", "Slug", "Tags", "Status", ""].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="group hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono text-xs font-bold text-blue-600">
                        N-{article.id}
                      </td>
                      <td className="px-5 py-4 max-w-[200px]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">
                            {article.title}
                          </p>
                          <Badge variant="primary">{article.category}</Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <p className="text-[10px] text-gray-500 font-medium">
                            {article.read_time || "—"} · {article.date}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900">/{article.slug}</p>
                        <p className="text-[10px] text-gray-400">{article.author}</p>
                      </td>
                      <td className="px-5 py-4 max-w-[140px]">
                        <div className="flex flex-wrap gap-1">
                          {article.tags
                            ? article.tags
                                .split(",")
                                .slice(0, 3)
                                .map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 rounded-full px-2 py-0.5"
                                  >
                                    <Tag className="w-2.5 h-2.5" />
                                    {tag.trim()}
                                  </span>
                                ))
                            : <span className="text-[10px] text-gray-400">—</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={article.is_active ? "success" : "neutral"}>
                          {article.is_active ? "Live" : "Hidden"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/news/${article.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            title="Open article"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleStatus(article.id, article.is_active)}
                            disabled={loading}
                            className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            title={article.is_active ? "Hide" : "Publish"}
                          >
                            {article.is_active ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => editArticle(article)}
                            disabled={loading}
                            className="p-2 rounded-lg transition-colors text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteArticle(article.id)}
                            disabled={loading}
                            className="p-2 rounded-lg transition-colors text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredArticles.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500 font-medium"
                      >
                        {search || filterCategory
                          ? "No articles match your filters."
                          : "No articles yet. Create your first one."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ── Form ──── */}
        <div className="space-y-6 order-1 lg:order-2">
          <Card
            id="news-form"
            title={editingId ? "Edit Article" : "New Article"}
            subtitle={
              editingId
                ? `Updating article N-${editingId}`
                : "Write and publish a news article"
            }
            className={editingId ? "border-blue-200 ring-4 ring-blue-50" : ""}
          >
            <form onSubmit={submitArticle} className="space-y-4">

              {/* Category — dropdown for consistency */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={handleChange("category")}
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none text-gray-700"
                >
                  <option value="">Select a category...</option>
                  {NEWS_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Headline
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleChange("title")}
                  placeholder="Article headline"
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={handleChange("slug")}
                  placeholder="url-friendly-slug"
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Summary
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={handleChange("description")}
                  placeholder="Short summary shown in article cards and previews"
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-600/20 transition-all outline-none resize-none"
                />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Full Article Content
                </label>
                <textarea
                  rows={12}
                  value={form.content}
                  onChange={handleChange("content")}
                  placeholder={"Write the full article here.\n\n## Sub heading\n\nParagraph text below it."}
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-sm font-medium leading-6 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none resize-y"
                />
                <div className="flex justify-between">
                  <p className="text-xs text-gray-500">
                    Use ## before a line for sub headings.
                  </p>
                  {form.content && (
                    <p className="text-xs text-blue-600 font-semibold">
                      ~{estimateReadTime(form.content)}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Tags
                  <span className="ml-1 normal-case font-normal text-gray-400">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={handleChange("tags")}
                  placeholder="ai, tech news, india, startup"
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                />
                {/* Live tag preview */}
                {form.tags && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {form.tags.split(",").filter(Boolean).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded-full px-2 py-0.5"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Cover image upload */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700"
                />
                <p className="text-xs text-gray-500">
                  {imageFile
                    ? `Selected: ${imageFile.name}`
                    : form.image
                    ? `Current: ${form.image}`
                    : "Upload a cover image for the article."}
                </p>
              </div>

              {/* Author + Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                    Author
                  </label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={handleChange("author")}
                    placeholder="Author name"
                    className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                    Date
                  </label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={handleChange("date")}
                    placeholder="Apr 6, 2026"
                    className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Read time (auto-filled but editable) */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Read Time
                  <span className="ml-1 normal-case font-normal text-gray-400">(auto-calculated)</span>
                </label>
                <input
                  type="text"
                  value={form.read_time}
                  onChange={handleChange("read_time")}
                  placeholder="4 min read"
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                />
              </div>

              {/* Author avatar upload */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Author Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700"
                />
                <p className="text-xs text-gray-500">
                  {avatarFile
                    ? `Selected: ${avatarFile.name}`
                    : form.avatar
                    ? `Current: ${form.avatar}`
                    : "Upload the author profile photo."}
                </p>
              </div>

              {/* Submit */}
              <div className="pt-4 flex gap-3">
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                )}
                <Button
                  type="submit"
                  className={editingId ? "flex-1" : "w-full"}
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Article"
                    : "Publish Article"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Info card */}
          <div className="p-6 rounded-2xl bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                <Newspaper className="w-5 h-5 text-blue-300" />
              </div>
              <h4 className="text-lg font-bold font-headline leading-tight mb-2">
                News vs Blog
              </h4>
              <p className="text-sm opacity-60 font-body mb-3">
                News articles include tags, read time, and a category dropdown matching your public news page structure at <code className="text-blue-300">/news/[slug]</code>.
              </p>
              <p className="text-sm opacity-60 font-body">
                Blogs at <code className="text-blue-300">/blog/[slug]</code> are long-form editorial content. News is for timely, tagged articles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}