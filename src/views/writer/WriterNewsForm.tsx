"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, LoaderCircle, Save, Search, X } from "lucide-react";
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
    publishDate: "",

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
  const [localNewsId, setLocalNewsId] = useState<string | null>(articleId);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [showStatusMessage, setShowStatusMessage] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ContentStatus | "scheduled">("draft");


  const formRef = useRef(form);
  const localNewsIdRef = useRef<string | null>(articleId);
  const isSubmittingRef = useRef(false);
  const hasChangesRef = useRef(false);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    localNewsIdRef.current = localNewsId;
  }, [localNewsId]);


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

        const data = (await response.json().catch(() => ({}))) as any;

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
          title: String(data?.title || ""),
          slug: String(data?.slug || ""),
          description: String(data?.description || ""),
          content: String(data?.content || ""),
          author: String(data?.author || writer?.name || ""),
          category: String(data?.category || "Technology"),
          publishDate: "",
          featuredImage: String(data?.image || ""),
          tags: parsedTags,
          metaTitle: "",
          metaDescription: "",
        });
          setLocalNewsId(String(data?.id ?? articleId));
        setCurrentStatus(typeof data?.status === 'string' ? data.status as ContentStatus : "draft");
        if (typeof data?.scheduled_at === 'string') {
          const date = new Date(data.scheduled_at);
          setScheduledAt(date.toISOString().slice(0, 16));
        }
        hasChangesRef.current = false;
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

const descriptionCount = useMemo(() => countPlainText(form.description).length, [form.description]);

  function updateField<K extends keyof NewsFormState>(field: K, value: NewsFormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  const submitArticle = useCallback(
    async (status: ContentStatus | "scheduled", isAutoSave = false, overrideScheduledAt?: string) => {
      const currentForm = formRef.current;

      const currentId = localNewsIdRef.current;
      const editMode = Boolean(currentId);

      if (!isAutoSave) {
        if (!currentForm.title.trim()) {
          toast.error("Article title is required.");
          return;
        }

        if (!currentForm.description.trim()) {
          toast.error("Short description is required.");
          return;
        }

        if (!currentForm.category.trim()) {
          toast.error("Category is required.");
          return;
        }

        if (!currentForm.featuredImage) {
          toast.error("Featured image is required.");
          return;
        }

        if (!countPlainText(currentForm.content)) {
          toast.error("Article content is required.");
          return;
        }
      } else {
        // Silent validation for auto-save
        if (!currentForm.title.trim() && !countPlainText(currentForm.content)) {
          return;
        }
        if (isSubmittingRef.current || submittingAction) {
          return;
        }
      }

      if (isAutoSave) {
        setAutoSaveStatus("saving");
      } else {
        setSubmittingAction(status);
      }

      isSubmittingRef.current = true;

      try {
        const payload = {
          title: currentForm.title.trim() || "Untitled News Draft",
          slug: slugify(currentForm.slug || currentForm.title),
          description: currentForm.description.trim(),
          content: currentForm.content,
          author: currentForm.author.trim(),
          category: currentForm.category,
          date: "",
          image: currentForm.featuredImage,
          tags: currentForm.tags.join(", "),
          status,
          scheduled_at: status === "scheduled" ? (overrideScheduledAt || scheduledAt) : null,
          metaTitle: currentForm.metaTitle.trim(),
          metaDescription: currentForm.metaDescription.trim(),
        };

        const response = await fetch(
          buildApiUrl(editMode ? `/api/writer/news/${currentId}` : "/api/writer/news"),
          {
            method: editMode ? "PUT" : "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = (await response.json().catch(() => ({}))) as ApiMessage & { id?: string | number };

        if (!response.ok) {
          throw new Error(data?.message || "Unable to save article");
        }

        if (!editMode && data?.id) {
          setLocalNewsId(String(data.id));
        }

        hasChangesRef.current = false;

        if (isAutoSave) {
          setAutoSaveStatus("success");
          setLastSavedAt(new Date());
          setShowStatusMessage(true);
          setTimeout(() => setShowStatusMessage(false), 5000);
        } else {
          toast.success(
            status === "published" 
              ? "Article published" 
              : status === "scheduled" 
                ? "Article scheduled" 
                : "Draft saved"
          );
          router.push("/writer/news");
          router.refresh();
        }
      } catch (error) {
        if (isAutoSave) {
          setAutoSaveStatus("error");
        } else {
          toast.error(error instanceof Error ? error.message : "Unable to save article");
        }
      } finally {
        if (!isAutoSave) {
          setSubmittingAction("");
        }
        isSubmittingRef.current = false;
      }
    },
    [router, submittingAction, scheduledAt]
  );

  // Auto-save logic
  useEffect(() => {
    const isActuallyEmpty = !form.featuredImage && !form.title && !form.description && !form.content && !form.tags.length;
    if (!isActuallyEmpty) {
      hasChangesRef.current = true;
    }
  }, [form.title, form.content, form.description, form.featuredImage, form.tags, form.slug]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasChangesRef.current) {
        void submitArticle("draft", true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [form.title, form.content, form.description, submitArticle]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasChangesRef.current) {
        void submitArticle("draft", true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [submitArticle]);

  useEffect(() => {
    return () => {
      if (hasChangesRef.current) {
        void submitArticle("draft", true);
      }
    };
  }, [submitArticle]);


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
      <div className="min-h-screen bg-[#f7f6f3] space-y-8 pb-32">
        <div className="border-b border-[#ebebeb] bg-white px-6 py-4 lg:px-10">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/writer/news")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#ebebeb] text-[#9a9a9a] transition hover:bg-[#fafaf8] hover:text-[#5b4ced]"
                aria-label="Back to news list"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h1 className="text-sm font-semibold text-[#1a1a1a]">
                {isEditMode ? "Edit Article" : "Create News Article"}
              </h1>
            </div>

              <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {autoSaveStatus === "saving" && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#9a9a9a]">
                    <LoaderCircle className="h-3 w-3 animate-spin text-[#5b4ced]" />
                    Saving...
                  </div>
                )}
                {autoSaveStatus === "success" && lastSavedAt && (
                  <div className="text-xs font-medium text-[#9a9a9a]">
                    Draft saved at {lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
                {autoSaveStatus === "error" && (
                  <div className="text-xs font-medium text-rose-500">
                    Auto-save failed
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSeoOpen(true)}
                className="text-sm font-medium text-[#5b4ced] hover:underline"
              >
                SEO Settings
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
            <div className="space-y-8">
              <section className="rounded-2xl border border-[#ebebeb] bg-white p-7">
                <div className="mb-4">
                  <h2 className="text-[15px] font-semibold text-[#1a1a1a]">
                    Article Details
                  </h2>
                </div>

                <div className="space-y-5">
                  <label className="block">
                    <span className="mb-1.5 block text-[13px] font-medium text-[#555]">Article Title</span>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(event) => updateField("title", event.target.value)}
                      placeholder="Enter article title..."
                      className="h-10 w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3.5 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
                    />
                  </label>

                  <div className="block">
                    <span className="mb-1.5 block text-[13px] font-medium text-[#555]">URL Slug</span>
                    <SlugInput
                      value={form.slug}
                      onChange={(slug) => updateField("slug", slug)}
                      prefix="/news/"
                      autoSource={form.title}
                      hint="Use lowercase letters, numbers, and hyphens only"
                    />
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-[13px] font-medium text-[#555]">Short Description</span>
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
                      className="w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3.5 py-3 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
                    />
                    <div className="mt-2 flex items-center justify-between gap-3 text-[12px] text-[#aaa]">
                      <span>This appears on article cards and search results</span>
                      <span>{descriptionCount}/{SHORT_DESCRIPTION_LIMIT} characters</span>
                    </div>
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-[#ebebeb] bg-white p-7">
                <div className="mb-4">
                  <h2 className="text-[15px] font-semibold text-[#1a1a1a]">
                    Article Content
                  </h2>
                  <p className="mt-1 text-[12px] text-[#aaa]">
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

          <aside className="space-y-8">
              <section className="rounded-2xl border border-[#ebebeb] bg-white p-7">

                <div className="mb-4">
                  <h2 className="text-[15px] font-semibold text-[#1a1a1a]">
                    Article Information
                  </h2>
                </div>

                <div className="space-y-6">
                  <label className="block">
                    <span className="mb-1.5 block text-[13px] font-medium text-[#555]">
                      Author
                    </span>
                    <input
                      type="text"
                      value={form.author}
                      readOnly
                      className="h-10 w-full rounded-[10px] border border-[#e5e5e5] bg-[#f2f2f2] px-3.5 text-sm text-[#888] outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[13px] font-medium text-[#555]">Category</span>
                    <select
                      value={form.category}
                      onChange={(event) => updateField("category", event.target.value)}
                      className="h-10 w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
                    >
                      {CATEGORY_OPTIONS.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-[#ebebeb] bg-white p-7">
                <div className="mb-4">
                  <h2 className="text-[15px] font-semibold text-[#1a1a1a]">
                    Featured Image
                  </h2>
                </div>

                <ImageUploadBox
                  value={form.featuredImage}
                  onChange={(url) => updateField("featuredImage", url || "")}
                  hint="PNG, JPG, WebP up to 5MB"
                />
              </section>

              <section className="rounded-2xl border border-[#ebebeb] bg-white p-7">
                <div className="mb-4">
                  <h2 className="text-[15px] font-semibold text-[#1a1a1a]">
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

          <div className="sticky bottom-0 z-40 border-t border-[#ebebeb] bg-white/80 backdrop-blur-md px-6 py-4 -mx-6 lg:-mx-10 mt-12">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => submitArticle("draft")}
                  disabled={Boolean(submittingAction)}
                  className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[#ebebeb] bg-white px-5 text-sm font-medium text-[#555] transition hover:bg-[#fafaf8] disabled:opacity-50"
                >
                  {submittingAction === "draft" ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save as Draft"
                  )}
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSchedulePopup(!showSchedulePopup)}
                    disabled={Boolean(submittingAction)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#5b4ced] bg-white px-5 text-sm font-medium text-[#5b4ced] transition hover:bg-[#f5f3ff] disabled:opacity-50"
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule
                  </button>

                  {showSchedulePopup && (
                    <div className="absolute bottom-full left-0 mb-3 w-72 rounded-2xl border border-[#ebebeb] bg-white p-5 shadow-xl animate-in fade-in slide-in-from-bottom-2">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-[12px] font-bold text-[#9a9a9a] uppercase tracking-widest">Schedule Article</p>
                        <button 
                          onClick={() => setShowSchedulePopup(false)}
                          className="text-[#9a9a9a] hover:text-[#1a1a1a]"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <input
                          type="datetime-local"
                          value={scheduledAt}
                          onChange={(e) => setScheduledAt(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          className="w-full rounded-xl border border-[#e5e5e5] bg-[#fafaf8] px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
                        />
                        <button
                          type="button"
                          disabled={!scheduledAt}
                          onClick={() => {
                            if (new Date(scheduledAt) <= new Date()) {
                              toast.error("Please select a future date and time.");
                              return;
                            }
                            setShowSchedulePopup(false);
                            void submitArticle("scheduled");
                          }}
                          className="w-full rounded-xl bg-[#5b4ced] py-3 text-sm font-bold text-white transition hover:bg-[#4a3ecc] disabled:opacity-50"
                        >
                          Confirm Schedule
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {currentStatus === "scheduled" && scheduledAt && (
                  <div className="flex items-center gap-3 rounded-xl bg-[#ede9fe] px-4 py-2.5 text-xs font-semibold text-[#5b4ced]">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      Scheduled for {new Date(scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => {
                        setScheduledAt("");
                        void submitArticle("draft", false, "");
                      }}
                      className="ml-1 text-[#5b4ced] hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => submitArticle("published")}
                  disabled={Boolean(submittingAction)}
                  className="inline-flex h-10 items-center justify-center rounded-[10px] bg-[#5b4ced] px-8 text-sm font-medium text-white transition hover:bg-[#4a3ecc] disabled:opacity-50"
                >
                  {submittingAction === "published" ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    "Publish"
                  )}
                </button>
              </div>
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
      </div>
    </>
  );
}

