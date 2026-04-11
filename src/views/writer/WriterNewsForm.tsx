"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Save, Search } from "lucide-react";
import { toast } from "sonner";
import ImageUploadBox from "@/components/writer/ImageUploadBox";
import RichTextEditor from "@/components/writer/RichTextEditor";
import SlugInput from "@/components/writer/SlugInput";
import TagInput from "@/components/writer/TagInput";
import { useWriterAuth } from "@/context/WriterAuthContext";
import { buildApiUrl } from "@/lib/api";
import type { ContentStatus, NewsFormState, SeoModalProps } from "@/types/writer";

const CATEGORY_OPTIONS = [
  "Breaking",
  "Technology",
  "Business",
  "Sports",
  "Entertainment",
  "Other",
];

const SHORT_DESCRIPTION_LIMIT = 300;

function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function countPlainText(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

interface ApiMessage {
  message?: string;
}

function createEmptyForm(author = ""): NewsFormState {
  return {
    title: "",
    slug: "",
    description: "",
    content: "",
    author,
    category: "Technology",
    publishDate: new Date().toISOString().split("T")[0],
    featuredImage: "",
    tags: [],
    metaTitle: "",
    metaDescription: "",
  };
}

function SeoModal({
  metaTitle,
  metaDescription,
  onChange,
  onClose,
}: SeoModalProps) {
  const metaTitleCount = metaTitle.trim().length;
  const metaDescriptionCount = metaDescription.trim().length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <div className="w-full max-w-2xl rounded-[1.8rem] border border-[#e7e2ff] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              SEO Settings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fine-tune how this article appears in search results.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e7e2ff] text-slate-500 transition hover:bg-[#f8f7ff] hover:text-slate-900"
            aria-label="Close SEO settings"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <label className="block">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800">Meta Title</span>
              <span className="text-xs text-[#6b7280]">Currently: {metaTitleCount} characters</span>
            </div>
            <input
              type="text"
              value={metaTitle}
              onChange={(event) => onChange("metaTitle", event.target.value)}
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
              value={metaDescription}
              onChange={(event) => onChange("metaDescription", event.target.value)}
              rows={4}
              placeholder="Optional SEO description"
              className="w-full rounded-xl border border-[#d8dbe4] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7c6ff7] focus:ring-2 focus:ring-[#7c6ff7]/20"
            />
            <p className="mt-2 text-xs text-[#6b7280]">Recommended length: 150–160 characters</p>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl bg-[#7c6ff7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6f61ef]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WriterNewsForm() {
  const params = useParams();
  const router = useRouter();
  const { writer } = useWriterAuth();
  const articleId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : null;
  const isEditMode = Boolean(articleId);
  const [form, setForm] = useState<NewsFormState>(createEmptyForm(writer?.name || ""));
  const [loadingArticle, setLoadingArticle] = useState(isEditMode);
  const [submittingAction, setSubmittingAction] = useState<ContentStatus | "">("");
  const [seoOpen, setSeoOpen] = useState(false);

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
    if (!isEditMode || !articleId) {
      setLoadingArticle(false);
      return;
    }

    let cancelled = false;

    async function loadArticle() {
      setLoadingArticle(true);

      try {
        const response = await fetch(buildApiUrl(`/api/writer/news/${articleId}`), {
          credentials: "include",
          cache: "no-store",
        });

        const data = (await response.json().catch(() => ({}))) as Record<string, any>;

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load article");
        }

        if (cancelled) {
          return;
        }

        const parsedTags = Array.isArray(data?.tags)
          ? data.tags
          : String(data?.tags || "")
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean);

        setForm({
          title: data?.title || "",
          slug: data?.slug || "",
          description: data?.description || "",
          content: data?.content || "",
          author: data?.author || writer?.name || "",
          category: data?.category || "Technology",
          publishDate: data?.date
            ? new Date(data.date).toString() !== "Invalid Date"
              ? new Date(data.date).toISOString().split("T")[0]
              : data.date
            : new Date().toISOString().split("T")[0],
          featuredImage: data?.image || "",
          tags: parsedTags,
          metaTitle: "",
          metaDescription: "",
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load article");
      } finally {
        if (!cancelled) {
          setLoadingArticle(false);
        }
      }
    }

    void loadArticle();

    return () => {
      cancelled = true;
    };
  }, [articleId, isEditMode, writer]);

  const descriptionCount = useMemo(() => form.description.length, [form.description]);

  function updateField<K extends keyof NewsFormState>(field: K, value: NewsFormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitArticle(status: ContentStatus) {
    if (!form.title.trim()) {
      toast.error("Article title is required.");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Short description is required.");
      return;
    }

    if (!form.category.trim()) {
      toast.error("Category is required.");
      return;
    }

    if (!form.featuredImage) {
      toast.error("Featured image is required.");
      return;
    }

    if (!countPlainText(form.content)) {
      toast.error("Article content is required.");
      return;
    }

    setSubmittingAction(status);

    try {
      const payload = {
        title: form.title.trim(),
        slug: slugify(form.slug || form.title),
        description: form.description.trim(),
        content: form.content,
        author: form.author.trim(),
        category: form.category,
        date: form.publishDate,
        image: form.featuredImage,
        tags: form.tags.join(", "),
        status,
        metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(),
      };

      const response = await fetch(
        buildApiUrl(isEditMode ? `/api/writer/news/${articleId}` : "/api/writer/news"),
        {
          method: isEditMode ? "PUT" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = (await response.json().catch(() => ({}))) as ApiMessage;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to save article");
      }

      toast.success(status === "published" ? "Article published" : "Draft saved");
      router.push("/writer/news");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save article");
    } finally {
      setSubmittingAction("");
    }
  }

  if (loadingArticle) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-[#e8e2ff] bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-[0_24px_60px_-40px_rgba(124,111,247,0.55)]">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#7c6ff7]" />
          Loading article...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-28">
        <div className="flex flex-col gap-4 rounded-[1.9rem] border border-[#e8e4ff] bg-white p-6 shadow-[0_26px_80px_-58px_rgba(124,111,247,0.75)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/writer/news")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ddd7ff] text-[#6a5ce8] transition hover:bg-[#f4f1ff]"
              aria-label="Back to news list"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                Create New News Article
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSeoOpen(true)}
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-[#ddd7ff] bg-white px-4 py-3 text-sm font-semibold text-[#6a5ce8] transition hover:bg-[#f4f1ff] sm:self-auto"
          >
            <Search className="h-4 w-4" />
            🔍 SEO Settings
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
          <div className="space-y-6">
            <section className="rounded-[1.8rem] border border-[#ece8ff] bg-white p-6 shadow-[0_24px_70px_-52px_rgba(124,111,247,0.65)]">
              <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  Article Details
                </h2>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                      Article Title
                    </span>
                    <span className="text-xs font-medium text-rose-500">Required</span>
                  </div>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="Enter article title..."
                    className="h-11 w-full rounded-xl border border-[#d8dbe4] bg-white px-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7c6ff7] focus:ring-2 focus:ring-[#7c6ff7]/20"
                  />
                </label>

                <div className="block">
                  <div className="mb-2 text-sm font-semibold text-slate-800">URL Slug</div>
                  <SlugInput
                    value={form.slug}
                    onChange={(slug) => updateField("slug", slug)}
                    prefix="/news/"
                    autoSource={form.title}
                    hint="Use lowercase letters, numbers, and hyphens only"
                  />
                </div>

                <label className="block">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                      Short Description
                    </span>
                    <span className="text-xs font-medium text-rose-500">Required</span>
                  </div>
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value.slice(0, SHORT_DESCRIPTION_LIMIT)
                      )
                    }
                    rows={5}
                    placeholder="Summarize the article in a concise, compelling way."
                    className="w-full rounded-xl border border-[#d8dbe4] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7c6ff7] focus:ring-2 focus:ring-[#7c6ff7]/20"
                  />
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs text-[#6b7280]">
                    <span>This appears on article cards and search results</span>
                    <span>{descriptionCount}/{SHORT_DESCRIPTION_LIMIT} characters</span>
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-[#ece8ff] bg-white p-6 shadow-[0_24px_70px_-52px_rgba(124,111,247,0.65)]">
              <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  Article Content
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create detailed content for your article with rich formatting, images, and more.
                </p>
              </div>

              <RichTextEditor
                value={form.content}
                onChange={(content) => updateField("content", content)}
                placeholder="Write your article here..."
                minHeight={400}
              />
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[1.8rem] border border-[#ece8ff] bg-white p-6 shadow-[0_24px_70px_-52px_rgba(124,111,247,0.65)]">
              <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  Article Information
                </h2>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">
                    Author
                  </span>
                  <input
                    type="text"
                    value={form.author}
                    readOnly
                    className="h-11 w-full rounded-xl border border-[#e5e0ff] bg-[#f6f4ff] px-4 text-sm text-slate-500 outline-none"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-800">Category</span>
                    <span className="text-xs font-medium text-rose-500">Required</span>
                  </div>
                  <select
                    value={form.category}
                    onChange={(event) => updateField("category", event.target.value)}
                    className="h-11 w-full rounded-xl border border-[#d8dbe4] bg-white px-4 text-sm text-[#111827] outline-none transition focus:border-[#7c6ff7] focus:ring-2 focus:ring-[#7c6ff7]/20"
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">
                    Publish Date
                  </span>
                  <input
                    type="date"
                    value={form.publishDate}
                    onChange={(event) => updateField("publishDate", event.target.value)}
                    className="h-11 w-full rounded-xl border border-[#d8dbe4] bg-white px-4 text-sm text-[#111827] outline-none transition focus:border-[#7c6ff7] focus:ring-2 focus:ring-[#7c6ff7]/20"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-[#ece8ff] bg-white p-6 shadow-[0_24px_70px_-52px_rgba(124,111,247,0.65)]">
              <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  Featured Image
                </h2>
              </div>

              <ImageUploadBox
                value={form.featuredImage}
                onChange={(url) => updateField("featuredImage", url || "")}
                hint="PNG, JPG, WebP up to 5MB"
              />
            </section>

            <section className="rounded-[1.8rem] border border-[#ece8ff] bg-white p-6 shadow-[0_24px_70px_-52px_rgba(124,111,247,0.65)]">
              <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  Tags
                </h2>
              </div>

              <TagInput
                tags={form.tags}
                onChange={(tags) => updateField("tags", tags)}
                placeholder="Add tag"
              />
            </section>
          </aside>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7e2ff] bg-white/92 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1400px] justify-end gap-3">
            <button
              type="button"
              onClick={() => submitArticle("draft")}
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
              onClick={() => submitArticle("published")}
              disabled={Boolean(submittingAction)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7c6ff7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6f61ef] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submittingAction === "published" ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditMode ? "Update Article" : "Create Article"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {seoOpen ? (
        <SeoModal
          metaTitle={form.metaTitle}
          metaDescription={form.metaDescription}
          onChange={updateField}
          onClose={() => setSeoOpen(false)}
        />
      ) : null}
    </>
  );
}

