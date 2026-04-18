import type { ReactNode } from "react";

export type ContentStatus = "draft" | "published" | string;

export interface WriterUser {
  id?: string | number;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export interface WriterAuthState {
  authenticated: boolean;
  writer: WriterUser | null;
}

export interface WriterAuthContextValue {
  writer: WriterUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<WriterUser | null>;
  logout: () => Promise<void>;
  refreshWriter: (options?: { showLoader?: boolean }) => Promise<WriterAuthState>;
}

export interface WriterLayoutProps {
  children: ReactNode;
}

export interface BlogFormState {
  featuredImage: string;
  title: string;
  author: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  tags: string[];
  content: string;
}

export interface NewsFormState {
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  category: string;
  publishDate: string;
  featuredImage: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
}

export interface WriterContentItem {
  id?: string | number;
  title?: string;
  slug?: string;
  image?: string;
  status?: ContentStatus;
  date?: string;
  created_at?: string;
  updated_at?: string;
  category?: string;
  description?: string;
  content?: string;
  author?: string;
  tags?: string[] | string;
  itemType?: "blog" | "news" | string;
  [key: string]: unknown;
}

export interface DashboardStats {
  totalBlogs: number;
  totalNews: number;
  drafts: number;
}

export interface SeoModalProps {
  metaTitle: string;
  metaDescription: string;
  onChange: (field: keyof Pick<NewsFormState, "metaTitle" | "metaDescription">, value: string) => void;
  onClose: () => void;
}
