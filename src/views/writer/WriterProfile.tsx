"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useWriterAuth } from "@/context/WriterAuthContext";
import { buildApiUrl } from "@/lib/api";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

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

  // Visibility State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (writer?.name) {
      setName(writer.name);
    }
  }, [writer]);

  const getInitials = (name?: string) => {
    if (!name) return "W";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

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

  const initials = getInitials(writer?.name);

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Card 1: Personal Information */}
        <section className="bg-white border border-[#ebebeb] rounded-3xl p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-fit">
          <h2 className="text-[15px] font-semibold text-[#1a1a1a] mb-8">Personal Information</h2>
          
          <div className="flex flex-col items-center mb-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5b4ced] text-[22px] font-bold text-white shadow-[0_8px_20px_rgba(91,76,237,0.2)]">
              {initials}
            </div>
            <p className="mt-3 text-[13px] font-medium text-[#9a9a9a]">Profile Identity</p>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#555]">Name </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3.5 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
                placeholder="Full Name"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#555]">Email Address</label>
              <p className="text-[14px] font-medium text-[#888] py-2">{writer?.email || ""}</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full h-10 flex items-center justify-center rounded-2xl bg-[#5b4ced] text-sm font-bold text-white transition-all hover:bg-[#4a3ecc] hover:shadow-[0_8px_20px_rgba(91,76,237,0.15)] disabled:opacity-50"
              >
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        {/* Card 2: Change Password */}
        <section className="bg-white border border-[#ebebeb] rounded-3xl p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-fit">
          <h2 className="text-[15px] font-semibold text-[#1a1a1a] mb-8">Change Password</h2>

          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#555]">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-10 w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3.5 pr-10 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9a9a] hover:text-[#5b4ced]"
                >
                  <Icon icon={showCurrentPassword ? "lucide:eye-off" : "lucide:eye"} width={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#555]">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3.5 pr-10 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9a9a] hover:text-[#5b4ced]"
                >
                  <Icon icon={showNewPassword ? "lucide:eye-off" : "lucide:eye"} width={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#555]">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 w-full rounded-[10px] border border-[#e5e5e5] bg-[#fafaf8] px-3.5 pr-10 text-sm text-[#111827] outline-none transition focus:border-[#5b4ced]"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9a9a] hover:text-[#5b4ced]"
                >
                  <Icon icon={showConfirmPassword ? "lucide:eye-off" : "lucide:eye"} width={16} />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full h-10 flex items-center justify-center rounded-2xl bg-[#1a1a1a] text-sm font-bold text-white transition-all hover:bg-black disabled:opacity-50"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
