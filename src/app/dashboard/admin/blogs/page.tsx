"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buildApiUrl } from "@/lib/api";
import { Badge, Button, Card } from "@/components/ui/atoms";
import {
  BookOpen,
  Edit2,
  Eye,
  EyeOff,
  ExternalLink,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

type Blog = {
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
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const fetchBlogs = async () => {
    try {
      setError(null);
      const res = await fetch(buildApiUrl("/api/blogs/admin"), {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await res.json();
      setBlogs(data);
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  useEffect(() => {
    void fetchBlogs();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setAvatarFile(null);
  };

  const handleChange =
    (field: keyof typeof emptyForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;

      setForm((current) => {
        if (field === "title" && !editingId && !current.slug.trim()) {
          return {
            ...current,
            title: value,
            slug: slugify(value),
          };
        }

        if (field === "slug") {
          return {
            ...current,
            slug: slugify(value),
          };
        }

        return { ...current, [field]: value };
      });
    };

  const submitBlog = async (e?: FormEvent) => {
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
      alert("Please fill all required blog fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = editingId
        ? buildApiUrl(`/api/blogs/${editingId}`)
        : buildApiUrl("/api/blogs");

      const payload = new FormData();
      payload.append("slug", slugify(form.slug || form.title));
      payload.append("category", form.category);
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("content", form.content);
      payload.append("author", form.author);
      payload.append("date", form.date || new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }));
      payload.append("image", form.image);
      payload.append("avatar", form.avatar);

      if (imageFile) {
        payload.append("imageFile", imageFile);
      }

      if (avatarFile) {
        payload.append("avatarFile", avatarFile);
      }

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        body: payload,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to save blog");
      }

      resetForm();
      await fetchBlogs();
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const editBlog = (blog: Blog) => {
    setEditingId(blog.id);
    setForm({
      slug: blog.slug,
      category: blog.category,
      title: blog.title,
      description: blog.description,
      content: blog.content,
      image: blog.image,
      author: blog.author,
      avatar: blog.avatar,
      date: blog.date,
    });
    setImageFile(null);
    setAvatarFile(null);
    document.getElementById("blog-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const deleteBlog = async (id: number) => {
    if (!confirm("Delete this blog?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(buildApiUrl(`/api/blogs/${id}`), {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to delete blog");
      }

      await fetchBlogs();
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number, isActive: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(buildApiUrl(`/api/blogs/${id}/status`), {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to update blog status");
      }

      await fetchBlogs();
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "Failed to update blog status");
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return blogs;
    }

    return blogs.filter((blog) =>
      [blog.title, blog.slug, blog.category, blog.author]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [blogs, search]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold font-headline text-gray-900 tracking-tighter sm:text-3xl">
            Blog Studio
          </h2>
          <p className="text-gray-500 font-medium">
            Create long blog posts and publish them to their own reading page.
          </p>
        </div>
        <Button
          size="sm"
          className="flex items-center gap-2 self-start sm:self-auto"
          onClick={() => {
            resetForm();
            document.getElementById("blog-form")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Plus className="w-4 h-4" />
          Create Blog
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center justify-between font-medium text-sm">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card className="overflow-hidden p-0">
            <div className="flex flex-col gap-4 border-b border-gray-100 bg-white p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
              <h3 className="font-bold font-headline text-lg">Published Blogs</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-600/20 md:w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-230 w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">ID</th>
                    <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Blog</th>
                    <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Slug</th>
                    <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Status</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="group hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-5 font-mono text-xs font-bold text-blue-600">B-{blog.id}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-900">{blog.title}</p>
                          <Badge variant="primary">{blog.category}</Badge>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium line-clamp-1">
                          {blog.description}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-gray-900">/{blog.slug}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{blog.date}</p>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant={blog.is_active ? "success" : "neutral"}>
                          {blog.is_active ? "Active" : "Hidden"}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            title="Open blog"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleStatus(blog.id, blog.is_active)}
                            disabled={loading}
                            className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            title={blog.is_active ? "Hide blog" : "Show blog"}
                          >
                            {blog.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => editBlog(blog)}
                            disabled={loading}
                            className="p-2 rounded-lg transition-colors text-blue-600 hover:bg-blue-50"
                            title="Edit blog"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBlog(blog.id)}
                            disabled={loading}
                            className="p-2 rounded-lg transition-colors text-red-600 hover:bg-red-50"
                            title="Delete blog"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBlogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                        No blogs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6 order-1 lg:order-2">
          <Card
            id="blog-form"
            title={editingId ? "Edit Blog" : "Create Blog"}
            subtitle={editingId ? `Updating blog B-${editingId}` : "Add a long-form blog for the website"}
            className={editingId ? "border-blue-200 ring-4 ring-blue-50" : ""}
          >
            <form onSubmit={submitBlog} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={handleChange("category")}
                  placeholder="e.g. App Development"
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleChange("title")}
                  placeholder="Blog title"
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={handleChange("slug")}
                  placeholder="blog-url-slug"
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={handleChange("description")}
                  placeholder="Short blog summary for cards and previews"
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-600/20 transition-all outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Full Blog Content</label>
                <textarea
                  rows={12}
                  value={form.content}
                  onChange={handleChange("content")}
                  placeholder="Write the full blog here. Leave blank lines between paragraphs."
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-sm font-medium leading-6 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none resize-y"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Blog Image Upload</label>
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
                      ? `Current image: ${form.image}`
                      : "Upload a cover image for the blog."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={handleChange("author")}
                    placeholder="Author name"
                    className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Date</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={handleChange("date")}
                    placeholder="Dec 20, 2025"
                    className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Author Avatar Upload</label>
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
                      ? `Current avatar: ${form.avatar}`
                      : "Upload the author profile image."}
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                {editingId && (
                  <Button type="button" variant="outline" className="flex-1" onClick={resetForm} disabled={loading}>
                    Clear
                  </Button>
                )}
                <Button type="submit" className={editingId ? "flex-1" : "w-full"} disabled={loading}>
                  {loading ? "Saving..." : editingId ? "Update Blog" : "Create Blog"}
                </Button>
              </div>
            </form>
          </Card>

          <div className="p-6 rounded-2xl bg-gray-900 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                <BookOpen className="w-5 h-5 text-blue-300" />
              </div>
              <h4 className="text-lg font-bold font-headline leading-tight mb-2">Long-Form Publishing</h4>
              <p className="text-sm opacity-60 font-body mb-4">
                Each blog now has its own slug and full reading page, so users can open the complete post instead of only seeing a card.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
