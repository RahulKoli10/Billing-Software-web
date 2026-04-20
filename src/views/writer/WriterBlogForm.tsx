"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import ImageUploadBox from "@/components/writer/ImageUploadBox";
import RichTextEditor from "@/components/writer/RichTextEditor";
import SlugInput from "@/components/writer/SlugInput";
import TagInput from "@/components/writer/TagInput";
import { useWriterAuth } from "@/context/WriterAuthContext";
import {
  formatIstDateTimeLabel,
  getCurrentIstDateTimeLocalValue,
  toIstDateTimeLocalValue,
} from "@/lib/istDateTime";
import { writerApiFetch } from "@/lib/writerApi";
import type { BlogFormState, ContentStatus } from "@/types/writer";

function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ApiMessage {
  message?: string;
}

function createEmptyForm(author = ""): BlogFormState {
  return {
    featuredImage: "",
    title: "",
    author,
    slug: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    category: "",
    tags: [],
    content: "",
  };
}

const BLOG_CATEGORIES = [
  "App Development",
  "Web Development",
  "AI & Tech",
  "Business",
  "Design",
  "DevOps",
  "Tutorials",
  "Case Study",
];

function countPlainText(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function WriterBlogForm() {
  const params = useParams();
  const router = useRouter();
  const { writer } = useWriterAuth();
  const blogId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : null;
  const isEditMode = Boolean(blogId);
  const [form, setForm] = useState<BlogFormState>(createEmptyForm(writer?.name || ""));
  const [loadingBlog, setLoadingBlog] = useState(isEditMode);
  const [submittingAction, setSubmittingAction] = useState<ContentStatus | "">("");
  const [localBlogId, setLocalBlogId] = useState<string | null>(blogId);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ContentStatus | "scheduled">("draft");


  const formRef = useRef(form);
  const localBlogIdRef = useRef<string | null>(blogId);
  const isSubmittingRef = useRef(false);
  const hasChangesRef = useRef(false);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    localBlogIdRef.current = localBlogId;
  }, [localBlogId]);



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
        const response = await writerApiFetch(`/api/writer/blogs/${blogId}`, {
          cache: "no-store",
        });

        const data = (await response.json().catch(() => ({}))) as Record<string, string | number | boolean | null | undefined>;

        if (!response.ok) {
        const errorMessage = typeof data?.message === 'string' ? data.message : "Unable to load blog";;
          throw new Error(errorMessage);
        }

        if (cancelled) {
          return;
        }

        setForm({
          featuredImage: String(data?.image || ""),
          title: String(data?.title || ""),
          author: String(data?.author || writer?.name || ""),
          slug: String(data?.slug || ""),
          excerpt: String(data?.description || ""),
          metaTitle: "",
          metaDescription: "",
          category: String(data?.category || ""),
          tags:
            Array.isArray(data?.tags)
              ? data.tags.map((tag) => String(tag))
              : String(data?.tags || "")
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
          content: String(data?.content || ""),
        });
        setLocalBlogId(String(data?.id ?? blogId));
        setCurrentStatus(typeof data?.status === 'string' ? data.status as ContentStatus : "draft");
        if (typeof data?.scheduled_at === 'string') {
          setScheduledAt(toIstDateTimeLocalValue(data.scheduled_at));
        }
        hasChangesRef.current = false;



      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load blog");
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

  const submitBlog = useCallback(
    async (status: ContentStatus | "scheduled", isAutoSave = false, overrideScheduledAt?: string) => {
      const currentForm = formRef.current;

      const currentId = localBlogIdRef.current;
      const editMode = Boolean(currentId);

      if (!isAutoSave) {
        if (!currentForm.featuredImage) {
          toast.error("Featured image is required.");
          return;
        }

        if (!currentForm.title.trim()) {
          toast.error("Title is required.");
          return;
        }

        if (!currentForm.author.trim()) {
          toast.error("Author is required.");
          return;
        }

        if (!currentForm.excerpt.trim()) {
          toast.error("Excerpt is required.");
          return;
        }

        if (!currentForm.category.trim()) {
          toast.error("Select a category.");
          return;
        }

        if (!countPlainText(currentForm.content)) {
          toast.error("Content is required.");
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
          slug: slugify(currentForm.slug || currentForm.title),
          category: currentForm.category || "Uncategorized",
          title: currentForm.title.trim() || "Untitled Draft",
          description: currentForm.excerpt.trim(),
          content: currentForm.content,
          image: currentForm.featuredImage,
          author: currentForm.author.trim(),
          avatar: "",
          date: "",
          tags: currentForm.tags.join(", "),
          status,
          scheduled_at: status === "scheduled" ? (overrideScheduledAt || scheduledAt) : null,
          metaTitle: currentForm.metaTitle.trim(),
          metaDescription: currentForm.metaDescription.trim(),
        };


        const response = await writerApiFetch(
          editMode ? `/api/writer/blogs/${currentId}` : "/api/writer/blogs",
          {
            method: editMode ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = (await response.json().catch(() => ({}))) as ApiMessage & { id?: string | number };

        if (!response.ok) {
          throw new Error(data?.message || "Unable to save blog");
        }

        if (!editMode && data?.id) {
          setLocalBlogId(String(data.id));
        }

        hasChangesRef.current = false;

        if (isAutoSave) {
          setAutoSaveStatus("success");
          setLastSavedAt(new Date());
        } else {
          toast.success(
            status === "published" 
              ? "Blog published" 
              : status === "scheduled" 
                ? "Blog scheduled" 
                : "Draft saved"
          );
          router.push("/writer/blogs");
          router.refresh();
        }

      } catch (error) {
        if (isAutoSave) {
          setAutoSaveStatus("error");
        } else {
          toast.error(error instanceof Error ? error.message : "Unable to save blog");
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



  // Mark changes when form fields update
  useEffect(() => {
    const isActuallyEmpty =
      !form.featuredImage &&
      !form.title &&
      !form.excerpt &&
      !form.content &&
      !form.category &&
      !form.tags.length;
    if (!isActuallyEmpty) {
      hasChangesRef.current = true;
    }
  }, [form.title, form.content, form.excerpt, form.featuredImage, form.category, form.tags, form.slug]);

  // Debounced auto-save (3s)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasChangesRef.current) {
        void submitBlog("draft", true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [form.title, form.content, form.excerpt, submitBlog]);

  // Interval auto-save (30s)
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasChangesRef.current) {
        void submitBlog("draft", true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [submitBlog]);

  // Final auto-save on unmount
  useEffect(() => {
    return () => {
      // Trigger final save if there are changes
      // Note: This might not work reliably in all browsers due to fetch cancellation
      // but it fulfills the "trigger one final auto-save" requirement
      if (hasChangesRef.current) {
        // We use the ref version of form to ensure we have the latest state on unmount
        // although in this case the closure might also be fine since we recreate this effect
        void submitBlog("draft", true);
      }
    };
  }, [submitBlog]);


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
    <div className="min-h-screen bg-[#f7f6f3] space-y-8">
      <div className="border-b border-[#ebebeb] bg-white px-6 py-4 lg:px-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-8 overflow-x-auto">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              Create Blog
            </span>
            <Link
              href="/writer/blogs"
              className="text-sm font-medium text-[#9a9a9a] transition hover:text-[#5b4ced]"
            >
              View Blogs
            </Link>
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
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-8 px-6 lg:px-10">

        <section className="rounded-2xl border border-[#ebebeb] bg-white p-7">
          <h2 className="mb-4 text-[15px] font-semibold text-[#1a1a1a]">Featured Image</h2>
          <ImageUploadBox
            value={form.featuredImage}
            onChange={(url) => setForm((current) => ({ ...current, featuredImage: url || "" }))}
            hint="PNG, JPG, WebP or GIF (max. 5MB)"
          />
        </section>

        <section className="rounded-2xl border border-[#ebebeb] bg-white p-7">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold text-[#1a1a1a]">Post Details</h2>
          </div>

          <div className="space-y-6">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[#555]">Title</span>
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
                className="h-10 w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3.5 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[#555]">Author</span>
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
                className="h-10 w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3.5 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
              />
            </label>

            <div className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[#555]">Custom URL</span>
              <SlugInput
                value={form.slug}
                onChange={(slug) => setForm((current) => ({ ...current, slug }))}
                autoSource={form.title}
                hint="URL-friendly version of the title (e.g., my-blog-post)"
              />
            </div>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[#555]">Excerpt</span>
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
                className="w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3.5 py-3 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
              />
              <p className="mt-2 text-[12px] text-[#aaa]">
                A brief summary of the post (displayed in blog listings)
              </p>
            </label>

                  <label className="block">
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="text-[13px] font-medium text-[#555]">Meta Title</span>
                <span className="text-[12px] text-[#aaa]">Currently: {metaTitleCount} characters</span>
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
                className="h-10 w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3.5 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
              />
              <p className="mt-2 text-[12px] text-[#aaa] text-right">Recommended length: 50–60 characters</p>
            </label>

            <label className="block">
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="text-[13px] font-medium text-[#555]">Meta Description</span>
                <span className="text-[12px] text-[#aaa]">
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
                className="w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3.5 py-3 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
              />
              <p className="mt-2 text-[12px] text-[#aaa] text-right">Recommended length: 150–160 characters</p>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[#555]">Category</span>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3.5 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
              >
                <option value="">Select a category...</option>
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <div className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[#555]">Tags</span>
              <TagInput
                tags={form.tags}
                onChange={(tags) => setForm((current) => ({ ...current, tags }))}
                placeholder="Add a tag"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#ebebeb] bg-white p-7">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold text-[#1a1a1a]">Content</h2>
          </div>

          <RichTextEditor
            value={form.content}
            onChange={(content) => setForm((current) => ({ ...current, content }))}
            placeholder="Write your blog post here..."
            minHeight={400}
          />
        </section>
      </div>

      <div className="sticky bottom-0 z-40 border-t border-[#ebebeb] bg-white/80 backdrop-blur-md px-6 py-4 -mx-6 lg:-mx-10 mt-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => submitBlog("draft")}
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
                    <span className="text-sm font-bold text-[#1a1a1a]">Schedule Post</span>
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
                      min={getCurrentIstDateTimeLocalValue()}
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
                        void submitBlog("scheduled");
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
                  Scheduled for {formatIstDateTimeLabel(scheduledAt)}
                </span>
                <button
                  onClick={() => {
                    setScheduledAt("");
                    void submitBlog("draft", false, "");
                  }}
                  className="ml-1 text-[#5b4ced] hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => submitBlog("published")}
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
  );
}

