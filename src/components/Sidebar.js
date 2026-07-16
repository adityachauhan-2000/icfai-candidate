"use client";

import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Newspaper,
  Target,
  Trophy,
  User,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    label: "Daily News",
    href: "/daily-news",
    icon: <Newspaper className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    label: "Study Plan",
    href: "/study-plan",
    icon: <BookOpen className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    label: "Case Studies",
    href: "/case-studies",
    icon: <Video className="w-[18px] h-[18px]" strokeWidth={2} />,
  },

  {
    label: "Preparation",
    href: "/preparation",
    icon: <Target className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    label: "Collaboration Zone",
    href: "/collaboration-zone",
    icon: <Users className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    label: "Assessments",
    href: "/assessments",
    icon: <ClipboardList className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: <Trophy className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: <User className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-7saqfpox9-adityas-projects-4b60fae5.vercel.app"}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        router.push("/login");
      }
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <aside
      className="w-60 shrink-0 h-full flex flex-col"
      style={{
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-purple)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6 py-5"
        style={{ borderBottom: "1px solid var(--border-purple)" }}
      >
        <div className="py-1">
          <Image
            src="https://www.ibsindia.org/wp-content/uploads/2017/08/ibs_logo.png"
            alt="IBS Logo"
            width={120}
            height={40}
            unoptimized
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <style jsx>{`
          nav::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <p
          className="text-xs font-semibold px-3 mb-2 uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          Menu
        </p>
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              onClick={() => {
                try {
                  // Clear prep caches to avoid conflicts
                  const keysToRemove = [];
                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (key.startsWith('answers_') || key.startsWith('skipped_'))) {
                      keysToRemove.push(key);
                    }
                  }
                  keysToRemove.forEach(k => localStorage.removeItem(k));
                } catch (e) { }
              }}
              style={{
                background: active ? "var(--accent)" : "transparent",
                color: active ? "#ffffff" : "var(--text-secondary)",
              }}
            >
              <span style={{ color: active ? "#ffffff" : "var(--accent)" }}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-md leading-none"
                  style={{
                    background: active
                      ? "rgba(255,255,255,0.25)"
                      : "var(--accent)",
                    color: active ? "#fff" : "#fff",
                    fontSize: "10px",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user info */}
      <div
        className="px-4 py-4"
        style={{ borderTop: "1px solid var(--border-purple)" }}
      >
        <Link
          href="/profile"
          className="flex items-center gap-3 px-2 py-2 rounded-xl mb-3 hover:bg-zinc-100 transition-colors cursor-pointer"
          style={{ background: "var(--accent-soft)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 uppercase overflow-hidden"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {user?.profile_image ? (
              <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name ? user.name.charAt(0) : "S"
            )}
          </div>
          <div className="overflow-hidden">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {user?.name || "Student"}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {user?.email || "student@ibs.edu"}
            </p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
