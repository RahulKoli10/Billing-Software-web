"use client";

import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { buildApiUrl } from "@/lib/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface UploadResponse {
  url?: string;
  message?: string;
}

interface ImageUploadBoxProps {
  value?: string | null;
  onChange?: (url: string | null) => void;
  hint?: string;
}

function resolveImageUrl(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  return buildApiUrl(value);
}

export default function ImageUploadBox({
  value = null,
  onChange,
  hint = "PNG, JPG, WebP or GIF (max. 5MB)",
}: ImageUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const previewUrl = resolveImageUrl(value);

  function handleOpenFilePicker() {
    if (isUploading) {
      return;
    }

    fileInputRef.current?.click();
  }

  function handleRemoveImage(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setError("");
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Max 5MB");
      event.target.value = "";
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const payload = new FormData();
      payload.append("image", file);

      const response = await fetch(buildApiUrl("/api/writer/upload-image"), {
        method: "POST",
        credentials: "include",
        body: payload,
      });

      const data = (await response.json().catch(() => ({}))) as UploadResponse;

      if (!response.ok || !data?.url) {
        throw new Error(data?.message || "Image upload failed");
      }

      onChange?.(data.url);
    } catch (uploadError) {
      console.error("Image upload failed", uploadError);
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        role="button"
        tabIndex={isUploading ? -1 : 0}
        onClick={handleOpenFilePicker}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (isUploading) {
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpenFilePicker();
          }
        }}
        className={`relative flex min-h-[160px] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-[#fafaf8] transition focus:outline-none focus:ring-2 focus:ring-[#5b4ced]/30 ${
          isUploading
            ? "cursor-wait border-[#cfc9ff]"
            : "cursor-pointer border-[#e0e0e0] hover:border-[#5b4ced]"
        } ${error ? "border-[#ef4444]" : ""}`}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="h-full min-h-64 w-full object-cover"
            />
            <button
              type="button"
              aria-label="Remove image"
              onClick={handleRemoveImage}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            {isUploading ? (
              <>
                <LoaderCircle className="h-8 w-8 animate-spin text-[#5b4ced]" />
                <p className="mt-3 text-sm font-semibold text-[#111827]">Uploading image...</p>
              </>
            ) : (
              <>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#ede9fe] text-[#5b4ced]">
                  <ImagePlus className="h-7 w-7" />
                </div>
                <p className="mt-4 text-sm font-semibold text-[#111827]">
                  Click to upload an image
                </p>
                <p className="mt-2 text-xs text-[#6b7280]">{hint}</p>
              </>
            )}
          </div>
        )}

        {previewUrl && isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="flex flex-col items-center gap-3 text-[#111827]">
              <LoaderCircle className="h-8 w-8 animate-spin text-[#5b4ced]" />
              <p className="text-sm font-semibold">Uploading image...</p>
            </div>
          </div>
        ) : null}
      </div>

      {error ? <p className="text-sm text-[#dc2626]">{error}</p> : null}
    </div>
  );
}

