"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Copy, KeyRound, Loader2, PenSquare, Plus, Power, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card } from "@/components/ui/atoms";
import { buildApiUrl } from "@/lib/api";

type Writer = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
};

type CredentialReveal = {
  email: string;
  password: string;
  title: string;
  description: string;
} | null;

function formatDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminContentWritersPage() {
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [revealedCredential, setRevealedCredential] = useState<CredentialReveal>(null);

  async function loadWriters() {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl("/api/admin/writers"), {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load content writers");
      }

      const data = await response.json();
      setWriters(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load content writers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadWriters();
  }, []);

  const activeCount = useMemo(
    () => writers.filter((writer) => writer.is_active).length,
    [writers]
  );

  function closeAddModal() {
    setShowAddModal(false);
    setName("");
    setEmail("");
  }

  async function copyPassword(password: string) {
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Password copied");
    } catch {
      toast.error("Unable to copy password");
    }
  }

  async function createWriter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(buildApiUrl("/api/admin/writers"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to create writer");
      }

      await loadWriters();
      closeAddModal();
      setRevealedCredential({
        email: data?.writer?.email || email,
        password: data?.password || "",
        title: "Writer account created",
        description: "Copy this password now. It will only be shown once here.",
      });
      toast.success("Writer created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create writer");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleWriter(writer: Writer) {
    setTogglingId(writer.id);

    try {
      const response = await fetch(buildApiUrl(`/api/admin/writers/${writer.id}/toggle`), {
        method: "PATCH",
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to update writer status");
      }

      await loadWriters();
      toast.success(writer.is_active ? "Writer deactivated" : "Writer activated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update writer status");
    } finally {
      setTogglingId(null);
    }
  }

  async function resetPassword(writer: Writer) {
    toast.custom(
      () => (
        <div className="p-4 bg-linear-to-r from-gray-500 to-gray-600 text-white rounded-xl shadow-lg max-w-sm mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <KeyRound className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Reset Password?</h3>
              <p className="text-sm opacity-90 mt-1">Old password for {writer.name} will be invalidated.</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-white/20">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 h-10 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-white/30"
              onClick={() => {
                toast.dismiss();
              }}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              className="flex-1 h-10 bg-white text-black hover:bg-white/90 font-semibold"
              onClick={() => {
                toast.dismiss();
                proceedReset(writer);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      {
        duration: 0,
        dismissible: false,
      }
    );
  }

  function confirmDeleteWriter(writer: Writer) {
    toast.custom(
      (toastId) => (
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-5 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-gray-900">Remove content writer?</h3>
              <p className="mt-1 text-sm text-gray-600">
                {writer.name} will lose writer access immediately. Existing blogs and news will stay in the system.
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                {writer.email}
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.dismiss(toastId)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={() => {
                toast.dismiss(toastId);
                void deleteWriter(writer);
              }}
            >
              Delete Writer
            </Button>
          </div>
        </div>
      ),
      {
        duration: 12000,
      }
    );
  }

  async function deleteWriter(writer: Writer) {
    setDeletingId(writer.id);
    const loadingToast = toast.loading(`Removing ${writer.name}...`);

    try {
      const response = await fetch(buildApiUrl(`/api/admin/writers/${writer.id}`), {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to remove writer");
      }

      setWriters((current) => current.filter((currentWriter) => currentWriter.id !== writer.id));
      toast.dismiss(loadingToast);
      toast.success("Content writer removed", {
        description: `${writer.name} no longer has access to the writer workspace.`,
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : "Unable to remove writer", {
        description: "The writer account was not deleted. Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function proceedReset(writer: Writer) {
    const loadingToast = toast.loading('Resetting password...');
    setResettingId(writer.id);

    try {
      const response = await fetch(
        buildApiUrl(`/api/admin/writers/${writer.id}/reset-password`),
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to reset password");
      }

      setRevealedCredential({
        email: data?.writer?.email || writer.email,
        password: data?.password || "",
        title: "Password reset complete",
        description: "Copy the new password now and share it securely with the writer.",
      });
      toast.success("Password reset complete");
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reset password");
      toast.dismiss(loadingToast);
    } finally {
      setResettingId(null);
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Content Writers
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Manage separate editorial logins without exposing the main admin account.
          </p>
        </div>
        <Button
          className="flex items-center gap-2 self-start sm:self-auto"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-4 w-4" />
          Add Writer
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-violet-100 bg-violet-50/60 shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-500">
            Total Writers
          </p>
          <p className="mt-3 text-3xl font-bold text-gray-900">{writers.length}</p>
        </Card>
        <Card className="shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-500">
            Active
          </p>
          <p className="mt-3 text-3xl font-bold text-gray-900">{activeCount}</p>
        </Card>
        <Card className="shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-500">
            Inactive
          </p>
          <p className="mt-3 text-3xl font-bold text-gray-900">
            {writers.length - activeCount}
          </p>
        </Card>
      </div>

      {revealedCredential ? (
        <Card className="border-violet-200 bg-violet-50/70">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-violet-700">
                {revealedCredential.title}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {revealedCredential.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRevealedCredential(null)}
              className="inline-flex h-10 w-10 items-center justify-center self-start rounded-xl border border-violet-200 bg-white text-gray-500 transition hover:text-gray-900"
              aria-label="Dismiss credentials"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="rounded-2xl border border-violet-200 bg-white px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Writer Email
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {revealedCredential.email}
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Generated Password
              </p>
              <p className="mt-2 font-mono text-sm font-bold text-violet-700">
                {revealedCredential.password}
              </p>
            </div>
            <Button
              className="flex items-center gap-2 self-start bg-violet-600 hover:bg-violet-700"
              onClick={() => void copyPassword(revealedCredential.password)}
            >
              <Copy className="h-4 w-4" />
              Copy Password
            </Button>
          </div>
        </Card>
      ) : null}

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="flex min-h-65 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-180 w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-50/60">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                    Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                    Email
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {writers.map((writer) => (
                  <tr key={writer.id} className="hover:bg-gray-50/70">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-violet-50 p-2 text-violet-600">
                          <PenSquare className="h-4 w-4" />
                        </div>
                        <p className="font-semibold text-gray-900">{writer.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {writer.email}
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={writer.is_active ? "success" : "warning"}>
                        {writer.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {formatDate(writer.created_at)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          disabled={togglingId === writer.id}
                          onClick={() => void toggleWriter(writer)}
                        >
                          <Power className="h-4 w-4" />
                          {togglingId === writer.id
                            ? "Saving..."
                            : writer.is_active
                              ? "Set Inactive"
                              : "Set Active"}
                        </Button>
                        <Button
                          variant="secondary"
                          className="flex items-center gap-2"
                          disabled={resettingId === writer.id}
                          onClick={() => void resetPassword(writer)}
                        >
                          <KeyRound className="h-4 w-4" />
                          {resettingId === writer.id ? "Resetting..." : "Reset password"}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          disabled={deletingId === writer.id}
                          onClick={() => confirmDeleteWriter(writer)}
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === writer.id ? "Deleting..." : ""}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!writers.length ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-sm text-gray-500">
                      No content writers yet. Add your first writer account to open the editorial workspace.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showAddModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add Writer</h3>
                <p className="mt-1 text-sm text-gray-500">
                  The password is auto-generated on creation and revealed once after save.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:text-gray-900"
                aria-label="Close add writer modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={createWriter} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-800">
                  Name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-800">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
              </label>

              <div className="flex justify-end gap-3 pt-3">
                <Button type="button" variant="outline" onClick={closeAddModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-violet-600 hover:bg-violet-700">
                  {submitting ? "Creating..." : "Create Writer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
