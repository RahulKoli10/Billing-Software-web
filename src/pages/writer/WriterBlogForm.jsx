"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import ImageUploadBox from "@/components/writer/ImageUploadBox";
import RichTextEditor from "@/components/writer/RichTextEditor";
import SlugInput from "@/components/writer/SlugInput";
import TagInput from "@/components/writer/TagInput";
import { useWriterAuth } from "@/context/WriterAuthContext";
import { buildApiUrl } from "@/lib/api";

function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createEmptyForm(author = "") {
  return {
    featuredImage: "",
    title: "",
    author,
    slug: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    categories: [],
    content: "",
  };
}

function countPlainText(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function WriterBlogForm() {
  const params = useParams();
  const router = useRouter();
  const { writer } = useWriterAuth();
  const blogId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : null;
  const isEditMode = Boolean(blogId);
  const [form, setForm] = useState(createEmptyForm(writer?.name || ""));
  const [loadingBlog, setLoadingBlog] = useState(isEditMode);
  const [submittingAction, setSubmittingAction] = useState("");

  useEffect(() => {
    setForm((current) => {
      if (current.author) {
        return current;
      }

      return {
        ...current,
        author: writer?.name || "",
      };
    });
  }, [writer]);

  useEffect(() => {
    if (!isEditMode || !blogId) {
      setLoadingBlog(false);
      return;
    }

    let cancelled = false;

    async function loadBlog() {
      setLoadingBlog(true);

      try {
        const response = await fetch(buildApiUrl(`/api/writer/blogs/${blogId}`), {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load blog");
        }

        if (cancelled) {
          return;
        }

        setForm({
          featuredImage: data?.image || "",
          title: data?.title || "",
          author: data?.author || writer?.name || "",
          slug: data?.slug || "",
          excerpt: data?.description || "",
          metaTitle: "",
          metaDescription: "",
          categories: data?.category ? [data.category] : [],
          content: data?.content || "",
        });
      } catch (error) {
        toast.error(error.message || "Unable to load blog");
      } finally {
        if (!cancelled) {
          setLoadingBlog(false);
        }
      }
    }

    void loadBlog();

    return () => {
      cancelled = true;
    };
  }, [blogId, isEditMode, writer]);

  const metaTitleCount = useMemo(() => form.metaTitle.trim().length, [form.metaTitle]);
  const metaDescriptionCount = useMemo(
    () => form.metaDescription.trim().length,
    [form.metaDescription]
  );

  async function submitBlog(status) {
    if (!form.featuredImage) {
      toast.error("Featured image is required.");
      return;
    }

    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!form.author.trim()) {
      toast.error("Author is required.");
      return;
    }

    if (!form.excerpt.trim()) {
      toast.error("Excerpt is required.");
      return;
    }

    if (!form.categories.length) {
      toast.error("Add at least one category.");
      return;
    }

    if (!countPlainText(form.content)) {
      toast.error("Content is required.");
      return;
    }

    setSubmittingAction(status);

    try {
      const payload = {
        slug: slugify(form.slug || form.title),
        category: form.categories[0],
        title: form.title.trim(),
        description: form.excerpt.trim(),
        content: form.content,
        image: form.featuredImage,
        author: form.author.trim(),
        avatar: "",
        date: "",
        status,
        metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(),
        categories: form.categories,
      };

      const response = await fetch(
        buildApiUrl(isEditMode ? `/api/writer/blogs/${blogId}` : "/api/writer/blogs"),
        {
          method: isEditMode ? "PUT" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to save blog");
      }

      toast.success(status === "published" ? "Blog published" : "Draft saved");
      router.push("/writer/blogs");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Unable to save blog");
    } finally {
      setSubmittingAction("");
    }
  }

  if (loadingBlog) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-[#e8e2ff] bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-[0_24px_60px_-40px_rgba(124,111,247,0.55)]">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#7c6ff7]" />
          Loading blog...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28">
      <div className="border-b border-[#e7e2ff]">
        <div className="flex items-center gap-8 overflow-x-auto">
          <span className="border-b-2 border-[#7c6ff7] pb-3 text-sm font-semibold text-[#534AB7]">
            Create Blog
          </span>
          <Link
            href="/writer/blogs"
            className="pb-3 text-sm font-medium text-slate-500 transition hover:text-[#534AB7]"
          >
            View Blogs
          </Link>
        </div>
      </div>

      <section className="rounded-[1.8rem] border border-[#ece8ff] bg-white p-6 shadow-[0_24px_70px_-52px_rgba(124,111,247,0.65)]">
        <ImageUploadBox
          value={form.featuredImage}
          onChange={(url) => setForm((current) => ({ ...current, featuredImage: url || "" }))}
          hint="PNG, JPG, WebP or GIF (max. 5MB)"
        />
      </section>

      <section className="rounded-[1.8rem] border border-[#ece8ff] bg-white p-6 shadow-[0_24px_70px_-52px_rgba(124,111,247,0.65)]">
        <div className="mb-5">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Post Details</h2>
        </div>

        <div className="space-y-5">
          <label className="block">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800">Title</span>
              <span className="text-xs font-medium text-rose-500">Required</span>
            </div>
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Write the blog title"
              className="h-11 w-full rounded-xl border border-[#d8dbe4] bg-white px-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7c6ff7] focus:ring-2 focus:ring-[#7c6ff7]/20"
            />
          </label>

          <label className="block">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800">Author</span>
              <span className="text-xs font-medium text-rose-500">Required</span>
            </div>
            <input
              type="text"
              value={form.author}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  author: event.target.value,
                }))
              }
              placeholder="Author name"
              className="h-11 w-full rounded-xl border border-[#d8dbe4] bg-white px-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7c6ff7] focus:ring-2 focus:ring-[#7c6ff7]/20"
            />
          </label>

          <div className="block">
            <div className="mb-2 text-sm font-semibold text-slate-800">Custom URL</div>
            <SlugInput
              value={form.slug}
              onChange={(slug) => setForm((current) => ({ ...current, slug }))}
              autoSource={form.title}
              hint="URL-friendly version of the title (e.g., my-blog-post)"
            />
          </div>

          <label className="block">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800">Excerpt</span>
              <span className="text-xs font-medium text-rose-500">Required</span>
            </div>
            <textarea
              value={form.excerpt}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  excerpt: event.target.value,
                }))
              }
              rows={4}
              placeholder="A brief summary of the post"
              className="w-full rounded-xl border border-[#d8dbe4] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7c6ff7] focus:ring-2 focus:ring-[#7c6ff7]/20"
            />
            <p className="mt-2 text-xs text-[#6b7280]">
              A brief summary of the post (displayed in blog listings)
            </p>
          </label>

          <label className="block">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800">Meta Title</span>
              <span className="text-xs text-[#6b7280]">Currently: {metaTitleCount} characters</span>
            </div>
            <input
              type="text"
              value={form.metaTitle}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  metaTitle: event.target.value,
                }))
              }
              placeholder="Optional SEO title"
              className="h-11 w-full rounded-xl border border-[#d8dbe4] bg-white px-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7c6ff7] focus:ring-2 focus:ring-[#7c6ff7]/20"
            />
            <p className="mt-2 text-xs text-[#6b7280]">Recommended length: 50–60 characters</p>
          </label>

          <label className="block">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800">Meta Description</span>
              <span className="text-xs text-[#6b7280]">
                Currently: {metaDescriptionCount} characters
              </span>
            </div>
            <textarea
              value={form.metaDescription}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  metaDescription: event.target.value,
                }))
              }
              rows={4}
              placeholder="Optional SEO description"
              className="w-full rounded-xl border border-[#d8dbe4] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7c6ff7] focus:ring-2 focus:ring-[#7c6ff7]/20"
            />
            <p className="mt-2 text-xs text-[#6b7280]">Recommended length: 150–160 characters</p>
          </label>

          <div className="block">
            <div className="mb-2 text-sm font-semibold text-slate-800">Categories</div>
            <TagInput
              tags={form.categories}
              onChange={(categories) => setForm((current) => ({ ...current, categories }))}
              placeholder="Add a category"
            />
          </div>
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-[#ece8ff] bg-white p-6 shadow-[0_24px_70px_-52px_rgba(124,111,247,0.65)]">
        <div className="mb-5">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Content</h2>
        </div>

        <RichTextEditor
          value={form.content}
          onChange={(content) => setForm((current) => ({ ...current, content }))}
          placeholder="Write your blog post here..."
          minHeight={400}
        />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7e2ff] bg-white/92 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => submitBlog("draft")}
            disabled={Boolean(submittingAction)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d7cffd] bg-white px-5 py-3 text-sm font-semibold text-[#6b5ee8] transition hover:bg-[#f7f5ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submittingAction === "draft" ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save as Draft"
            )}
          </button>

          <button
            type="button"
            onClick={() => submitBlog("published")}
            disabled={Boolean(submittingAction)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7c6ff7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6f61ef] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submittingAction === "published" ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
