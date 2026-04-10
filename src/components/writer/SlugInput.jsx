"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, LockOpen } from "lucide-react";

function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function SlugInput({
  value = "",
  onChange,
  prefix = "",
  hint = "Use lowercase letters, numbers, and hyphens only",
  autoSource = "",
  locked = false,
}) {
  const [isLocked, setIsLocked] = useState(locked);

  // Keep a stable ref to the latest onChange so effects don't need
  // it in their dependency arrays — prevents infinite re-render loops
  // when the parent passes an inline arrow function.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    setIsLocked(locked);
  }, [locked]);

  useEffect(() => {
    if (isLocked) {
      return;
    }

    onChangeRef.current?.(slugify(autoSource));
  }, [autoSource, isLocked]); // ← onChange intentionally omitted via ref

  function handleInputChange(event) {
    const nextSlug = slugify(event.target.value);
    setIsLocked(true);
    onChangeRef.current?.(nextSlug);
  }

  function handleToggleLock() {
    if (isLocked) {
      setIsLocked(false);
      onChangeRef.current?.(slugify(autoSource));
      return;
    }

    setIsLocked(true);
  }

  return (
    <div className="space-y-2">
      <div className="flex overflow-hidden rounded-xl border border-[#d8dbe4] bg-white focus-within:border-[#7c6ff7] focus-within:ring-2 focus-within:ring-[#7c6ff7]/20">
        {prefix ? (
          <div className="flex items-center border-r border-[#e5e7eb] bg-[#f3f4f6] px-3 text-sm text-[#6b7280]">
            {prefix}
          </div>
        ) : null}

        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="url-friendly-slug"
          className="h-11 flex-1 bg-white px-4 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
        />

        <button
          type="button"
          aria-label={isLocked ? "Unlock slug auto-generation" : "Lock slug for manual editing"}
          onClick={handleToggleLock}
          className="inline-flex h-11 w-11 items-center justify-center border-l border-[#e5e7eb] text-[#6b7280] transition hover:bg-[#f8f7ff] hover:text-[#534AB7]"
        >
          {isLocked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
        </button>
      </div>

      <p className="text-xs text-[#6b7280]">{hint}</p>
    </div>
  );
}
