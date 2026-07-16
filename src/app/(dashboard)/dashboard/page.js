"use client";

import Link from "next/link";
import {
  BookOpen,
  Video,
  Users,
  Target,
  ClipboardList,
  Trophy,
  User,
  ArrowRight,
} from "lucide-react";

const dashboardLinks = [
  {
    title: "Study Plan",
    description: "Access your tailored curriculum and track your progress.",
    href: "/study-plan",
    icon: BookOpen,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-500",
  },
  {
    title: "Case Studies",
    description: "Analyze real-world business scenarios and success stories.",
    href: "/case-studies",
    icon: Video,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-500",
  },
  {
    title: "Preparation",
    description: "Prepare for placements with mock interviews and resources.",
    href: "/preparation",
    icon: Target,
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    textColor: "text-rose-500",
  },
  {
    title: "Connect Student",
    description: "Network with peers, alumni, and mentors in the community.",
    href: "/connect-students",
    icon: Users,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-500",
  },
  {
    title: "Assessments",
    description: "Take quizzes and tests to evaluate your knowledge.",
    href: "/assessments",
    icon: ClipboardList,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-500",
  },
  {
    title: "Leaderboard",
    description: "See where you stand among your peers and stay motivated.",
    href: "/leaderboard",
    icon: Trophy,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-500",
  },
  {
    title: "Profile",
    description: "Manage your personal information and account settings.",
    href: "/profile",
    icon: User,
    color: "bg-zinc-500",
    lightColor: "bg-zinc-50",
    textColor: "text-zinc-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="h-full w-full p-4 sm:p-6 md:p-10 lg:p-12 overflow-y-auto overflow-x-hidden" style={{ background: "var(--bg-main)" }}>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Welcome back, aditya! 👋
          </h1>
          <p className="max-w-2xl text-sm md:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Here&apos;s an overview of your learning journey. Navigate through your modules, track your progress, and prepare for your future.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 pb-20">
          {dashboardLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                key={item.title}
                className="group relative flex flex-col p-6 bg-white rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Decorative Background Overlay */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-full mix-blend-overlay ${item.color}`}></div>
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.lightColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${item.textColor}`} strokeWidth={2} />
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300" style={{ background: "var(--bg-main)", color: "var(--text-muted)" }}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="space-y-2 relative z-10">
                  <h3 className="text-lg font-bold transition-colors" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed transition-colors" style={{ color: "var(--text-secondary)" }}>
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
