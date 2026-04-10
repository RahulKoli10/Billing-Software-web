import { WriterAuthProvider } from "@/context/WriterAuthContext";

export default function WriterRootLayout({ children }) {
  return <WriterAuthProvider>{children}</WriterAuthProvider>;
}
