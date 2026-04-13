"use client";

import type { ChangeEvent, KeyboardEvent } from "react";
import { useState } from "react";

interface TagInputProps {
  tags?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  buttonLabel?: string;
}

export default function TagInput({
  tags = [],
  onChange,
  placeholder = "Add a category",
  buttonLabel = "Add",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  function addTag() {
    const nextTag = inputValue.trim();

    if (!nextTag) {
      return;
    }

    const alreadyExists = tags.some((tag) => tag.toLowerCase() === nextTag.toLowerCase());

    if (alreadyExists) {
      setInputValue("");
      return;
    }

    onChange?.([...tags, nextTag]);
    setInputValue("");
  }

  function removeTag(tagToRemove: string) {
    onChange?.(tags.filter((tag) => tag !== tagToRemove));
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value)}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="h-10 flex-1 rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#5b4ced]"
        />

        <button
          type="button"
          onClick={addTag}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#5b4ced] px-5 text-sm font-semibold text-white transition hover:bg-[#4a3ecc]"
        >
          {buttonLabel}
        </button>
      </div>

      {tags.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 rounded-md bg-[#ede9fe] px-3 py-1 text-xs font-semibold text-[#5b4ced]"
            >
              <span>{tag}</span>
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => removeTag(tag)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[#5b4ced] transition hover:bg-[#d8d0ff]"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

