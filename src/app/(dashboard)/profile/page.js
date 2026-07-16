"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Feedback states
  const [nameSuccess, setNameSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const fileInputRef = useRef(null);

  const [programName, setProgramName] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/auth/student/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setStudent(data);
          setName(data.name);

          if (data.program_id) {
            const progRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/programs/${data.program_id}`);
            if (progRes.ok) {
              const progData = await progRes.json();
              setProgramName(progData.name);
            }
          }
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Failed to fetch student profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [router]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setNameSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/auth/student/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
        setNameSuccess("Profile name updated successfully.");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/auth/student/me/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      if (res.ok) {
        setPasswordSuccess("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        const data = await res.json();
        setPasswordError(data.detail || "Failed to update password");
      }
    } catch (err) {
      setPasswordError("Network error occurred.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/auth/student/me/upload-image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setStudent((prev) => ({ ...prev, profile_image: data.profile_image }));
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      console.error("Failed to upload image", err);
    } finally {
      setImageUploading(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-black mb-8 tracking-tight text-zinc-900">Student Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200 text-center flex flex-col items-center">

            <div className="relative group cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-100 shadow-sm relative flex items-center justify-center bg-zinc-100">
                {student.profile_image ? (
                  <img src={student.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-zinc-400 uppercase">{student.name.charAt(0)}</span>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {imageUploading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white text-xs font-semibold mt-1">Upload</span>
                    </>
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <h2 className="text-xl font-bold text-zinc-900 truncate w-full">{student.name}</h2>
            <p className="text-zinc-500 text-sm truncate w-full mt-1">{student.email}</p>
            <span className="mt-4 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
              {programName ? `Enrolled in ${programName}` : (student.program_id ? "Enrolled Student" : "Candidate")}
            </span>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">

          {/* General Information */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
            <h3 className="text-lg font-bold text-zinc-900 mb-6">General Information</h3>
            <form onSubmit={handleUpdateName}>
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Display Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-zinc-900"
                />
              </div>

              {nameSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
                  {nameSuccess}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={name === student.name}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Security */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
            <h3 className="text-lg font-bold text-zinc-900 mb-6">Security</h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-zinc-900"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-zinc-900"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
                  {passwordSuccess}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!currentPassword || !newPassword}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
