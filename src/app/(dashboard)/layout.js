"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-7saqfpox9-adityas-projects-4b60fae5.vercel.app"}/auth/student/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setAuthenticated(true);
        } else {
          router.replace("/login");
        }
      } catch (err) {
        router.replace("/login");
      }
    };
    checkAuth();
  }, [router]);

  // Close sidebar on route change
  useEffect(() => {
    if (pathname) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  if (!authenticated || !user) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-zinc-50 text-sm font-semibold text-zinc-400 font-sans">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col md:flex-row h-full w-full overflow-hidden"
      style={{ background: "var(--bg-main)" }}
    >
      {/* Desktop Sidebar (visible on md and up) */}
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar user={user} />
      </div>

      {/* Mobile Sidebar overlay/drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay backdrop button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm border-none w-full h-full cursor-default"
            aria-label="Close menu backdrop"
          />
          {/* Drawer content */}
          <div className="relative flex flex-col w-60 h-full bg-white shadow-xl animate-fade-in">
            <Sidebar user={user} />
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Mobile Header bar */}
        <header
          className="flex md:hidden items-center justify-between px-6 py-4 border-b bg-white shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded-lg hover:bg-zinc-100 transition-all cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <title>Menu</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span
              className="font-bold text-sm tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              ICFAI
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
