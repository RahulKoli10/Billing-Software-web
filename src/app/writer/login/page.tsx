import { Suspense } from "react";
import WriterLogin from "@/views/writer/WriterLogin";

function WriterLoginLoading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,111,247,0.24),_transparent_32%),linear-gradient(180deg,#f9f8ff_0%,#f2f1ff_45%,#ffffff_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_32px_80px_-30px_rgba(124,111,247,0.45)] backdrop-blur">
        <p className="text-sm font-medium text-slate-600">Loading writer login...</p>
      </div>
    </div>
  );
}

export default function WriterLoginPage() {
  return (
    <Suspense fallback={<WriterLoginLoading />}>
      <WriterLogin />
    </Suspense>
  );
}

