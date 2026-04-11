"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useWriterAuth } from "@/context/WriterAuthContext";
import { buildApiUrl } from "@/lib/api";
import { toast } from "sonner";
import { KeyRound, User } from "lucide-react";

export default function WriterProfile() {
  const { writer, refreshWriter } = useWriterAuth();

  // Personal Info State
  const [name, setName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (writer?.name) {
      setName(writer.name);
    }
  }, [writer]);

  async function handleProfileUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setIsSavingProfile(true);
      const response = await fetch(buildApiUrl("/api/writer/auth/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update profile");
      }

      await refreshWriter();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const response = await fetch(buildApiUrl("/api/writer/auth/change-password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update password");
      }

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <section className="overflow-hidden rounded-[1.6rem] border border-[#ece8ff] bg-white p-6 shadow-[0_22px_60px_-42px_rgba(124,111,247,0.5)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0edff] text-[#7c6ff7]">
            <User className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Personal Info</h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#e6e2ff] bg-[#fcfbff] px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#7c6ff7] focus:bg-white focus:ring-4 focus:ring-[#7c6ff7]/10"
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={writer?.email || ""}
              readOnly
              className="w-full rounded-xl border border-[#ece8ff] bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
              title="Email address cannot be changed"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="inline-flex items-center justify-center rounded-xl bg-[#7c6ff7] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#7c6ff7]/30 transition hover:-translate-y-0.5 hover:bg-[#6a5ce8] hover:shadow-[#7c6ff7]/40 disabled:pointer-events-none disabled:opacity-70"
            >
              {isSavingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-[1.6rem] border border-[#ece8ff] bg-white p-6 shadow-[0_22px_60px_-42px_rgba(124,111,247,0.5)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0edff] text-[#7c6ff7]">
            <KeyRound className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-5">
          <div>
            <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-slate-700">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-[#e6e2ff] bg-[#fcfbff] px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#7c6ff7] focus:bg-white focus:ring-4 focus:ring-[#7c6ff7]/10"
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-slate-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-[#e6e2ff] bg-[#fcfbff] px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#7c6ff7] focus:bg-white focus:ring-4 focus:ring-[#7c6ff7]/10"
              placeholder="Enter new password (min. 8 characters)"
              required
              minLength={8}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-[#e6e2ff] bg-[#fcfbff] px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#7c6ff7] focus:bg-white focus:ring-4 focus:ring-[#7c6ff7]/10"
              placeholder="Confirm your new password"
              required
              minLength={8}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-70"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

