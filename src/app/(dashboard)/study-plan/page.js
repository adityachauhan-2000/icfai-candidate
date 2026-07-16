"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

const initialWeekPlan = [
  {
    code: "SLFI611",
    title: "Financial Statement Analysis",
    subject: "Finance",
    status: "completed",
    progress: 100,
  },
  {
    code: "SLFI620",
    title: "FinTech",
    subject: "Finance",
    status: "completed",
    progress: 100,
  },
  {
    code: "SLFI602",
    title: "International Finance & Trade",
    subject: "Finance",
    status: "completed",
    progress: 100,
  },
  {
    code: "SLBK610",
    title: "Investment Banking",
    subject: "Finance",
    status: "in-progress",
    progress: 20,
  },
  {
    code: "SLFI610",
    title: "Project Appraisal & Finance",
    subject: "Finance",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLFI605",
    title: "Security Analysis",
    subject: "Finance",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLHR610",
    title: "Employment Laws",
    subject: "Human Resources",
    status: "completed",
    progress: 100,
  },
  {
    code: "SLHR613",
    title: "HR Analytics",
    subject: "Human Resources",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLHR601",
    title: "HR Planning",
    subject: "Human Resources",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLHR607",
    title: "Performance Management and Reward System",
    subject: "Human Resources",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLHR608",
    title: "Training & Development",
    subject: "Human Resources",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLIT609",
    title: "Business Intelligence",
    subject: "IT",
    status: "completed",
    progress: 100,
  },
  {
    code: "SLBA605",
    title: "Financial Business Analytics",
    subject: "IT",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLBA606",
    title: "Marketing Business Analytics",
    subject: "IT",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLMM602",
    title: "Consumer Behaviour",
    subject: "Marketing",
    status: "completed",
    progress: 100,
  },
  {
    code: "SLMM615",
    title: "Digital Marketing",
    subject: "Marketing",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLMM601",
    title: "Marketing Research",
    subject: "Marketing",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLMM610",
    title: "Product Management",
    subject: "Marketing",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLMM606",
    title: "Sales and Distribution Management",
    subject: "Marketing",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLMM604",
    title: "Services Marketing",
    subject: "Marketing",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLOM606",
    title: "Supply Chain Management",
    subject: "Operations",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLGM611",
    title: "Business Strategy",
    subject: "Core",
    status: "completed",
    progress: 100,
  },
  {
    code: "SLIT610",
    title: "Business Process Integration",
    subject: "Core",
    status: "upcoming",
    progress: 0,
  },
  {
    code: "SLMS601",
    title: "Corporate Career Management",
    subject: "Core",
    status: "upcoming",
    progress: 0,
  },
];

const statusConfig = {
  completed: { label: "Completed", bg: "#d1fae5", color: "#065f46" },
  "in-progress": { label: "In Progress", bg: "#ede9fe", color: "#5b21b6" },
  upcoming: { label: "Upcoming", bg: "#f3f4f6", color: "#6b7280" },
};

const testimonialVideos = [
  {
    id: "KgViamGlhYI",
    url: "https://youtu.be/KgViamGlhYI",
    title: "Dr  Arijit Bhattacharya - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/KgViamGlhYI/hqdefault.jpg",
  },
  {
    id: "nC8KEjvJ6Oc",
    url: "https://www.youtube.com/watch?v=nC8KEjvJ6Oc",
    title: "Dr  Dimple Pandey - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/nC8KEjvJ6Oc/hqdefault.jpg",
  },
  {
    id: "T3W-1XHz5D4",
    url: "https://www.youtube.com/watch?v=T3W-1XHz5D4",
    title: "Dr  Swaha Shome - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/T3W-1XHz5D4/hqdefault.jpg",
  },
  {
    id: "qQcFEgQlSPY",
    url: "https://youtu.be/qQcFEgQlSPY",
    title: "Dr  Roopali Srivastava - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/qQcFEgQlSPY/hqdefault.jpg",
  },
  {
    id: "d5KoY78mNPk",
    url: "https://youtu.be/d5KoY78mNPk",
    title: "Dr Priyanka Dhingra - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/d5KoY78mNPk/hqdefault.jpg",
  },
  {
    id: "nQ6B0QkUv-4",
    url: "https://youtu.be/nQ6B0QkUv-4",
    title: "Prof  Chitvan Mehrotra - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/nQ6B0QkUv-4/hqdefault.jpg",
  },
  {
    id: "_iaFe3heD_E",
    url: "https://youtu.be/_iaFe3heD_E",
    title: "Prof  Kedar Dunakhe - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/_iaFe3heD_E/hqdefault.jpg",
  },
  {
    id: "CqsBy_pK93g",
    url: "https://youtu.be/CqsBy_pK93g",
    title: "Prof  Nitin Bolinjkar - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/CqsBy_pK93g/hqdefault.jpg",
  },
  {
    id: "-0xzom5XZSo",
    url: "https://youtu.be/-0xzom5XZSo",
    title: "Prof  Punit Neb - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/-0xzom5XZSo/hqdefault.jpg",
  },
  {
    id: "CGHRjGyiEBU",
    url: "https://www.youtube.com/watch?v=CGHRjGyiEBU",
    title: "Prof  Shobha Pillai - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/CGHRjGyiEBU/hqdefault.jpg",
  },
];

const parseVideoTitle = (title) => {
  const cleanTitle = title.replace(/\s+/g, " ");
  const parts = cleanTitle.split(/ - | – /);

  let name = parts[0] || "IBS Faculty";
  let subtitle = parts[1] || "ICFAI Business School";

  name = name.replace(/^Dr\s+/, "Dr. ").replace(/^C A\s+/, "CA. ");
  subtitle = subtitle.replace(", ", " • ");

  return { name, subtitle };
};

export default function StudyPlanPage() {
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [weekPlan, setWeekPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programName, setProgramName] = useState("Semester-III");

  const parsedVideos = useMemo(() => {
    return testimonialVideos.map((video) => ({
      ...video,
      ...parseVideoTitle(video.title),
    }));
  }, []);

  useEffect(() => {
    const fetchStudyPlan = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-7saqfpox9-adityas-projects-4b60fae5.vercel.app"}/api/student/me/study-plan`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setWeekPlan(data);
        }
      } catch (err) {
        console.error("Failed to fetch study plan", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchProgramName = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-7saqfpox9-adityas-projects-4b60fae5.vercel.app"}/auth/student/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.program_id) {
            const progRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-7saqfpox9-adityas-projects-4b60fae5.vercel.app"}/programs/${data.program_id}`);
            if (progRes.ok) {
              const progData = await progRes.json();
              setProgramName(progData.name);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch program", err);
      }
    };

    fetchStudyPlan();
    fetchProgramName();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Your Study Plan
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Built around {programName} curriculum and placement goals
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdjustOpen(!adjustOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-purple)",
            color: "var(--accent)",
          }}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <title>Adjust plan icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Adjust plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Column: Semester-III Electives Curriculum */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl p-5 h-[80vh] flex flex-col"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex-1 flex flex-col min-h-0">
              <p
                className="text-sm font-semibold mb-4 shrink-0"
                style={{ color: "var(--text-secondary)" }}
              >
                {programName} Curriculum
              </p>
              <div className="flex-1 overflow-y-auto pr-2 py-1 flex flex-col gap-3">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : weekPlan.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                    <p className="font-medium text-sm">No courses assigned to your program yet.</p>
                  </div>
                ) : (
                  weekPlan.map((item) => {
                    const sc = statusConfig[item.status] || { label: item.status, bg: "#f3f4f6", color: "#6b7280" };
                    const isToday = item.status === "in-progress";
                    return (
                      <Link
                        key={item.code}
                        href={`/study-plan/${item.code}`}
                        className={`flex flex-wrap items-center justify-between gap-y-3 gap-x-4 p-4 rounded-xl border transition-all hover:bg-zinc-100/30 hover:border-zinc-300 text-left w-full cursor-pointer ${isToday
                            ? "bg-purple-50/40 border-purple-200 shadow-xs"
                            : "bg-[#f9f9f9] border-zinc-200/80 shadow-xs"
                          }`}
                      >
                        {/* Left: Code Tag & Course Title info */}
                        <div className="flex items-center gap-3 min-w-[200px] flex-1">
                          {/* Course Code Tag */}
                          <span
                            className={`font-mono text-[11px] font-bold px-2.5 py-1.5 rounded-lg border shrink-0 text-center min-w-[76px] ${isToday
                                ? "bg-zinc-900 text-white border-zinc-900"
                                : "bg-white text-zinc-600 border-zinc-200/60"
                              }`}
                          >
                            {item.code}
                          </span>

                          {/* Title and Stream */}
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-zinc-900 truncate">
                              {item.title}
                            </h3>
                            <p className="text-xs text-zinc-400 font-medium mt-0.5">
                              {item.subject}
                            </p>
                          </div>
                        </div>

                        {/* Right: Progress Bar & Status Pill */}
                        <div className="flex items-center gap-3 shrink-0 ml-auto">
                          {/* Minimal Progress Bar */}
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-zinc-200/60 rounded-full overflow-hidden shrink-0">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${item.progress}%`,
                                  background:
                                    item.status === "completed"
                                      ? "var(--success)"
                                      : "var(--accent)",
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 w-8 text-right">
                              {item.progress}%
                            </span>
                          </div>

                          {/* Status Label */}
                          <span
                            className="text-xs font-semibold px-3 py-1 rounded-full text-center min-w-[80px]"
                            style={{ background: sc.bg, color: sc.color }}
                          >
                            {sc.label}
                          </span>
                        </div>
                      </Link>
                    );
                  }))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Vertical scrollable Case Studies */}
        <div className="lg:col-span-1">
          <div
            className="rounded-2xl p-5 h-[80vh] flex flex-col"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex-1 flex flex-col min-h-0">
              <div className="shrink-0 mb-4">
                <h2
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Case Studies & Testimonials
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Real-world success stories from IBS Business School.
                </p>
              </div>

              {/* Scrollable list of testimonial items */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 scroll-smooth">
                {parsedVideos.map((video) => (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setActiveVideo(video)}
                    className="flex items-center gap-3 p-2.5 rounded-xl border text-left bg-[#f9f9f9] hover:bg-zinc-100 hover:shadow-xs transition-all w-full cursor-pointer"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-950">
                      <Image
                        src={video.thumbnail}
                        alt={video.name}
                        width={96}
                        height={54}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-xs">
                          <svg
                            className="w-2.5 h-2.5 text-zinc-950 fill-current translate-x-0.5"
                            viewBox="0 0 24 24"
                          >
                            <title>Play video</title>
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Text details */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-xs leading-snug text-zinc-900 truncate"
                        title={video.name}
                      >
                        {video.name}
                      </h3>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                        {video.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Iframe Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 bg-black/60 backdrop-blur-xs border-none w-full h-full cursor-default"
            onClick={() => setActiveVideo(null)}
            aria-label="Close modal backdrop"
          />

          {/* Modal Box */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col z-10 animate-fade-in border border-zinc-200">
            {/* Title / Close Bar */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-100 shrink-0">
              <div>
                <h2 className="font-bold text-sm text-zinc-900 leading-tight">
                  {activeVideo.name}
                </h2>
                <p className="text-xs text-zinc-500">{activeVideo.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-zinc-700 cursor-pointer"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <title>Close Modal</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Video Iframe Wrapper */}
            <div className="flex-1 min-h-0 relative aspect-video bg-black w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-zinc-50 flex justify-between items-center shrink-0">
              <span className="text-xs font-semibold text-zinc-500">
                Source: {activeVideo.author}
              </span>
              <a
                href={activeVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 shadow-xs"
              >
                Open on YouTube
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <title>Open link</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
