import type { ReactNode } from "react";
import { WriterAuthProvider } from "@/context/WriterAuthContext";

export default function WriterRootLayout({ children }: { children: ReactNode }) {
  return <WriterAuthProvider>{children}</WriterAuthProvider>;
}

