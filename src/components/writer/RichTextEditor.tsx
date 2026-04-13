"use client";

import type { ChangeEvent, MouseEventHandler, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import CodeBlock from "@tiptap/extension-code-block";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";


import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ImagePlus,
  Link2,
  List,
  ListOrdered,
  Table2,
  Plus,
  Trash2,
  Merge,
  Split,
} from "lucide-react";
import { Icon } from "@iconify/react";

import { buildApiUrl } from "@/lib/api";

const ACTIVE_BUTTON_CLASS = "bg-[#7c6ff7] text-white border-[#7c6ff7]";
const INACTIVE_BUTTON_CLASS =
  "bg-white text-[#4b5563] border-transparent hover:bg-[#f4f3ff] hover:text-[#5b4de4]";

interface ToolbarButtonProps {
  active?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  title: string;
  className?: string;
  children: ReactNode;
}

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

interface UploadResponse {
  url?: string;
  message?: string;
}

function ToolbarButton({
  active = false,
  disabled = false,
  onClick,
  title,
  className = "",
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md border text-xs font-semibold transition ${
        active ? ACTIVE_BUTTON_CLASS : INACTIVE_BUTTON_CLASS
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-[#e5e7eb]" aria-hidden="true" />;
}

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start writing...",
  minHeight = 300,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Image,
      CodeBlock,
      Link.configure({
        openOnClick: false,
        autolink: false,
        defaultProtocol: "https",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
    ],
    [placeholder]
  );


  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "rich-text-editor prose prose-sm max-w-none focus:outline-none min-h-full text-[#111827]",
      },
    },
    onUpdate: ({ editor: currentEditor }: { editor: Editor }) => {
      onChange?.(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const normalizedValue = value || "";
    const currentHtml = editor.getHTML();

    if (normalizedValue !== currentHtml) {
      editor.commands.setContent(normalizedValue, { emitUpdate: false });
    }
  }, [editor, value]);

  async function handleAddLink() {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) {
      return;
    }

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmedUrl }).run();
  }

  function handleImageButtonClick() {
    fileInputRef.current?.click();
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !editor) {
      event.target.value = "";
      return;
    }

    setIsUploadingImage(true);

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

      editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
    } catch (error) {
      console.error("Rich text image upload failed", error);
      window.alert(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  }

  const contentStyle = { minHeight: `${minHeight}px` };

  return (
    <div className="overflow-hidden rounded-xl border border-[#d8dbe4] bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#e5e7eb] bg-white px-3 py-2">
        <ToolbarButton
          title="Heading 1"
          active={editor?.isActive("heading", { level: 1 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          active={editor?.isActive("heading", { level: 2 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor?.isActive("heading", { level: 3 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Bold"
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor?.isActive("underline")}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          U
        </ToolbarButton>

        <div className="relative group/color">
          <ToolbarButton
            title="Text Color"
            className="flex flex-col relative overflow-hidden"
          >
            <span className="text-sm leading-none mt-[-2px]">A</span>
            <div 
              className="absolute bottom-1 left-1.5 right-1.5 h-[2px] rounded-full" 
              style={{ backgroundColor: editor?.getAttributes("textStyle").color || "#000000" }}
            />
          </ToolbarButton>
          
          <div className="invisible group-hover/color:visible absolute top-full left-0 z-50 mt-1 min-w-[140px] rounded-lg border border-[#e5e7eb] bg-white p-2 shadow-xl">
            <div className="grid grid-cols-5 gap-1.5">
              {[
                "#000000", "#374151", "#ef4444", "#f97316", "#eab308",
                "#22c55e", "#3b82f6", "#5b4ced", "#ec4899", "#ffffff"
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  className="h-5 w-5 rounded-md border border-[#eee]"
                  style={{ backgroundColor: color }}
                  onClick={() => editor?.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
            <div className="mt-2 border-t border-[#f3f4f6] pt-2">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-[#f9fafb] p-1 rounded-md transition-colors">
                <div className="relative h-5 w-5 rounded-md border border-[#eee] flex items-center justify-center overflow-hidden">
                   <Icon icon="lucide:pipette" width={10} className="text-[#6b7280] z-10" />
                   <input
                    type="color"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                    value={editor?.getAttributes("textStyle").color || "#000000"}
                  />
                </div>
                <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Custom Color</span>
              </label>
            </div>
          </div>
        </div>

        <Divider />

        <ToolbarButton
          title="Bullet List"
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered List"
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Insert Link"
          active={editor?.isActive("link")}
          onClick={handleAddLink}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Insert Image"
          disabled={isUploadingImage}
          onClick={handleImageButtonClick}
        >
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Insert Table"
          onClick={() =>
            editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <Table2 className="h-4 w-4" />
        </ToolbarButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <Divider />

        <ToolbarButton
          title="Align Left"
          active={editor?.isActive({ textAlign: "left" })}
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Align Center"
          active={editor?.isActive({ textAlign: "center" })}
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Align Right"
          active={editor?.isActive({ textAlign: "right" })}
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Inline Code"
          active={editor?.isActive("code")}
          onClick={() => editor?.chain().focus().toggleCode().run()}
          className="text-[11px]"
        >
          {"</>"}
        </ToolbarButton>
        <ToolbarButton
          title="Code Block"
          active={editor?.isActive("codeBlock")}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          {"{ }"}
        </ToolbarButton>

        <div className="ml-auto">
          <ToolbarButton
            title="Preview"
            active={isPreview}
            onClick={() => setIsPreview((current) => !current)}
            className="w-auto px-2 text-sm"
          >
            {"\u{1F441} Preview"}
          </ToolbarButton>
        </div>
      </div>


      {editor?.isActive("table") && (
        <div className="flex flex-wrap items-center gap-1 border-b border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5">
          <ToolbarButton
            title="Add Column Left"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="w-auto px-1.5 flex gap-1 items-center"
          >
            <Plus className="h-3 w-3" /> <span className="text-[10px]">Col Left</span>
          </ToolbarButton>
          <ToolbarButton
            title="Add Column Right"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="w-auto px-1.5 flex gap-1 items-center"
          >
            <Plus className="h-3 w-3" /> <span className="text-[10px]">Col Right</span>
          </ToolbarButton>
          <ToolbarButton
            title="Delete Column"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="w-auto px-1.5 flex gap-1 items-center text-red-500"
          >
            <Trash2 className="h-3 w-3" /> <span className="text-[10px]">Col</span>
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            title="Add Row Above"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="w-auto px-1.5 flex gap-1 items-center"
          >
            <Plus className="h-3 w-3" /> <span className="text-[10px]">Row Above</span>
          </ToolbarButton>
          <ToolbarButton
            title="Add Row Below"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="w-auto px-1.5 flex gap-1 items-center"
          >
            <Plus className="h-3 w-3" /> <span className="text-[10px]">Row Below</span>
          </ToolbarButton>
          <ToolbarButton
            title="Delete Row"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="w-auto px-1.5 flex gap-1 items-center text-red-500"
          >
            <Trash2 className="h-3 w-3" /> <span className="text-[10px]">Row</span>
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            title="Merge Cells"
            onClick={() => editor.chain().focus().mergeCells().run()}
            className="w-auto px-1.5 flex gap-1 items-center"
          >
            <Merge className="h-3 w-3" /> <span className="text-[10px]">Merge</span>
          </ToolbarButton>
          <ToolbarButton
            title="Split Cell"
            onClick={() => editor.chain().focus().splitCell().run()}
            className="w-auto px-1.5 flex gap-1 items-center"
          >
            <Split className="h-3 w-3" /> <span className="text-[10px]">Split</span>
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            title="Delete Table"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="ml-auto w-auto px-1.5 flex gap-1 items-center text-red-600 bg-red-50 hover:bg-red-100 border-red-100"
          >
            <Trash2 className="h-3 w-3" /> <span className="text-[10px]">Delete Table</span>
          </ToolbarButton>
        </div>
      )}


      {isPreview ? (
        <div
          className="prose prose-lg max-w-none p-4 min-h-[300px] border rounded overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }}
        />
      ) : (
        <div
          className="border-t-0 p-3 focus-within:outline-2 focus-within:outline-[#7c6ff7]"

          style={contentStyle}
        >
          <EditorContent editor={editor} className="min-h-full" />
        </div>
      )}

      <style jsx global>{`
        .rich-text-editor p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .rich-text-editor h1 {
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0.75rem 0;
        }

        .rich-text-editor h2 {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.25;
          margin: 0.75rem 0;
        }

        .rich-text-editor h3 {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.3;
          margin: 0.75rem 0;
        }

        .rich-text-editor p,
        .rich-text-editor ul,
        .rich-text-editor ol,
        .rich-text-editor pre,
        .rich-text-editor blockquote {
          margin: 0.75rem 0;
        }

        .rich-text-editor ul,
        .rich-text-editor ol {
          padding-left: 1.5rem;
        }

        .rich-text-editor code {
          background: #f3f4f6;
          border-radius: 0.375rem;
          padding: 0.125rem 0.35rem;
        }

        .rich-text-editor pre {
          background: #111827;
          border-radius: 0.75rem;
          color: #f9fafb;
          padding: 0.875rem 1rem;
          white-space: pre-wrap;
        }

        .rich-text-editor pre code {
          background: transparent;
          padding: 0;
        }

        .rich-text-editor a {
          color: #5b4de4;
          text-decoration: underline;
        }

        .rich-text-editor img {
          border-radius: 0.75rem;
          height: auto;
          margin: 1rem 0;
          max-width: 100%;
        }

        .rich-text-editor table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }

        .rich-text-editor td,
        .rich-text-editor th {
          min-width: 100px;
          border: 1px solid #d1d5db;
          padding: 8px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }

        .rich-text-editor th {
          font-weight: bold;
          text-align: left;
          background-color: #f3f4f6;
        }

        .rich-text-editor .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: #f0edff;
          pointer-events: none;
        }

        .rich-text-editor .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #7c6ff7;
          pointer-events: none;
        }

        .rich-text-editor .tableWrapper {
          overflow-x: auto;
        }

        .rich-text-editor .resize-cursor {
          cursor: ew-resize;
          cursor: col-resize;
        }

      `}</style>
    </div>
  );
}
