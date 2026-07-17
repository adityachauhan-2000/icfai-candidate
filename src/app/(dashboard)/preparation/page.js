"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brain, MessageSquare, Video } from "lucide-react";

export default function PreparationPage() {
  const [companies, setCompanies] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selfPrepCompany, setSelfPrepCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/companies`);
        if (!res.ok) throw new Error("Failed to load companies");
        const data = await res.json();
        // Exclude the Self Preparation dummy company from the main grid listing
        setCompanies(data.filter(c => c.id !== 999));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    async function fetchSelfPrep() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/companies/999`);
        if (res.ok) {
          setSelfPrepCompany(await res.json());
        }
      } catch (e) {
        console.error("Error loading self prep company", e);
      }
    }
    async function fetchSessions() {
      try {
        const token = localStorage.getItem("student_token");
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/all-sessions`, {
          headers,
          credentials: "include"
        });
        if (res.ok) {
          setSessions(await res.json());
        }
      } catch (e) {
        console.error("Error fetching all sessions", e);
      }
    }
    fetchCompanies();
    fetchSelfPrep();
    fetchSessions();
  }, []);

  const aptRound = selfPrepCompany?.rounds?.find(r => r.type === "aptitude");
  const gdRound = selfPrepCompany?.rounds?.find(r => r.type === "gd");
  const interviewRound = selfPrepCompany?.rounds?.find(r => r.type === "interview" || r.type === "hr");

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Demo Company Placement Prep
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Select a company to practice their exact custom recruitment rounds under real timed conditions.
        </p>
      </div>

      {/* Self Preparation Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Self Preparation
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Practice isolated assessments on specific rounds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Aptitude */}
          <Link
            href="/preparation/aptitude"
            target="_blank"
            className="p-6 rounded-3xl border bg-white flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-all group"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex justify-between items-start">
              <span className="w-8 h-8 rounded-full border bg-zinc-50 text-zinc-600 flex items-center justify-center font-bold text-sm">
                <Brain className="w-4 h-4" />
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                Practice
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 transition-colors">
                Aptitude Test
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                60 minutes
              </p>
            </div>
          </Link>

          {/* Card 2: Topic Preparation */}
          <Link
            href="/preparation/gd"
            target="_blank"
            className="p-6 rounded-3xl border bg-white flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-all group"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex justify-between items-start">
              <span className="w-8 h-8 rounded-full border bg-zinc-50 text-zinc-600 flex items-center justify-center font-bold text-sm">
                <MessageSquare className="w-4 h-4" />
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                Practice
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 transition-colors">
                Topic Preparation
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                10 minutes
              </p>
            </div>
          </Link>

          {/* Card 3: Interview */}
          <Link
            href="/preparation/interview"
            target="_blank"
            className="p-6 rounded-3xl border bg-white flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-all group"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex justify-between items-start">
              <span className="w-8 h-8 rounded-full border bg-zinc-50 text-zinc-600 flex items-center justify-center font-bold text-sm">
                <Video className="w-4 h-4" />
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                Practice
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 transition-colors">
                Interview
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                20 minutes
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Companies Grid Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Company Specific Prep
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Practice under real company-specific timed conditions.
          </p>
        </div>

        {isLoading ? (
          <div className="py-10 flex justify-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
            {companies.map((company) => (
              <Link
                key={company.id}
                href={`/preparation/company/${company.id}`}
                className="group aspect-square rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-200 hover:shadow-sm hover:border-zinc-400 border cursor-pointer text-center bg-white"
                style={{
                  borderColor: "var(--border)"
                }}
              >
                {/* Minimal Logo box */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 border bg-zinc-50 overflow-hidden p-1.5"
                  style={{
                    borderColor: "var(--border)"
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={company.icon}
                    alt={company.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Company Name */}
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {company.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Session History Section */}
      <div className="space-y-6 pt-6 border-t border-zinc-200">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Placement Preparation History
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Review your past assessment sessions and AI evaluations across all companies.
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-sm text-zinc-400 font-semibold">
            No past sessions found. Start a company preparation to see your results!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions
              .filter((sess) => sess.company_id !== 999 && sess.company?.name !== "Company #999")
              .map((sess) => {
                const companyName = sess.company?.name || `Company #${sess.company_id}`;
                const companyIcon = sess.company?.icon || "";
                return (
                  <div
                    key={sess.id}
                    className="p-5 rounded-2xl bg-white border flex flex-col justify-between hover:shadow-md transition-all space-y-4"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {companyIcon && (
                          <div className="w-10 h-10 rounded-xl bg-zinc-50 border p-1 flex items-center justify-center overflow-hidden" style={{ borderColor: "var(--border)" }}>
                            <img src={companyIcon} alt={companyName} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-sm font-bold text-zinc-900">{companyName}</h3>
                          <p className="text-[10px] text-zinc-400 font-medium">Session ID: #{sess.id}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                        Score: {sess.overall_score || 0}/100
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-zinc-50 flex-wrap gap-2">
                      <div className="flex gap-2">
                        {sess.aptitude_score?.attempted > 0 && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold uppercase tracking-wide">
                            Apt: {sess.aptitude_score?.correct || 0} / {sess.aptitude_score?.attempted || 0}
                          </span>
                        )}
                        {sess.gd_analysis?.transcript && sess.gd_analysis.transcript !== "No audio provided for the group discussion." && (
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold uppercase tracking-wide">
                            GD Done
                          </span>
                        )}
                        {sess.interview_analysis?.transcript && sess.interview_analysis.transcript !== "No audio provided for the interview." && (
                          <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded font-bold uppercase tracking-wide">
                            Interview Done
                          </span>
                        )}
                        {(!sess.aptitude_score?.attempted && (!sess.gd_analysis?.transcript || sess.gd_analysis.transcript === "No audio provided for the group discussion.") && (!sess.interview_analysis?.transcript || sess.interview_analysis.transcript === "No audio provided for the interview.")) && (
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
                            No Valid Data
                          </span>
                        )}
                      </div>
                      <Link
                        href={sess.company_id === 999 ? `/preparation/company/999/analysis?session=${sess.id}` : `/preparation/company/${sess.company_id}/analysis?session=${sess.id}`}
                        className="px-4 py-1.5 bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
                      >
                        View Report →
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
