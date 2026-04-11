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
          className="h-11 flex-1 rounded-xl border border-[#d8dbe4] bg-white px-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7c6ff7] focus:ring-2 focus:ring-[#7c6ff7]/20"
        />

        <button
          type="button"
          onClick={addTag}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#7c6ff7] px-5 text-sm font-semibold text-white transition hover:bg-[#6d5ff0]"
        >
          {buttonLabel}
        </button>
      </div>

      {tags.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 rounded-full bg-[#EEEDFE] px-3 py-1.5 text-xs font-medium text-[#534AB7]"
            >
              <span>{tag}</span>
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => removeTag(tag)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[#534AB7] transition hover:bg-[#ddd9ff]"
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

