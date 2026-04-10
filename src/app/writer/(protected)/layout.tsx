'use client';
import type { ReactNode } from "react";
import WriterPrivateRoute from "@/components/WriterPrivateRoute";
import WriterLayout from "@/views/writer/WriterLayout";

export default function WriterProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <WriterPrivateRoute>
      <WriterLayout>{children}</WriterLayout>
    </WriterPrivateRoute>
  );
}

