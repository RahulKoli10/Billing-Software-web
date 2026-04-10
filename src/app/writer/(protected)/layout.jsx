import WriterPrivateRoute from "@/components/WriterPrivateRoute";
import WriterLayout from "@/pages/writer/WriterLayout";

export default function WriterProtectedLayout({ children }) {
  return (
    <WriterPrivateRoute>
      <WriterLayout>{children}</WriterLayout>
    </WriterPrivateRoute>
  );
}
