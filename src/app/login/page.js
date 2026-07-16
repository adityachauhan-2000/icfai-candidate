"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CandidateLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-7saqfpox9-adityas-projects-4b60fae5.vercel.app"}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensures HttpOnly cookie is set
      });

      if (res.ok) {
        // Redirect to dashboard
        router.push("/preparation");
      } else {
        const data = await res.json();
        setError(data.detail || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred during login. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px] opacity-60"></div>

      <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-xl border rounded-3xl shadow-xl z-10 animate-fade-in" style={{ borderColor: "var(--border)" }}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img
              src="https://www.ibsindia.org/wp-content/uploads/2017/08/ibs_logo.png"
              alt="IBS Logo"
              className="h-12 w-auto object-contain drop-shadow-sm"
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>Student Portal</h1>
          <p className="text-sm mt-2 font-medium" style={{ color: "var(--text-secondary)" }}>Log in to access your study plans and progress</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 animate-fade-in text-red-800 text-sm font-semibold">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-white border rounded-2xl outline-none focus:ring-4 transition-all text-sm font-medium"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
              placeholder="student@ibs.edu"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-white border rounded-2xl outline-none focus:ring-4 transition-all text-sm font-medium"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 rounded-2xl text-white font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Secure Login</span>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
