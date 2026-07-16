"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import CompanyRoundsList from "@/components/CompanyRoundsList";

export default function CompanyLandingPage({ params }) {
  const { id } = use(params);
  
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/preparation/companies/${id}`);
        if (!res.ok) throw new Error("Company not found");
        const data = await res.json();
        
        // Ensure rounds are sorted by order_index
        if (data.rounds) {
          data.rounds.sort((a, b) => a.order_index - b.order_index);
        }
        
        setConfig(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    async function fetchSessions() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/preparation/sessions/${id}`, {
          credentials: "include"
        });
        if (res.ok) {
          setSessions(await res.json());
        }
      } catch (e) {}
    }
    fetchCompany();
    fetchSessions();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-bold">{error || "Company not found"}</h1>
        <Link
          href="/preparation"
          className="text-sm underline mt-2 inline-block"
        >
          Go back
        </Link>
      </div>
    );
  }

  const firstRound = config.rounds && config.rounds.length > 0 ? config.rounds[0] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Navigation Buttons Row */}
      <div className="flex justify-between items-center">
        <Link
          href="/preparation"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:bg-zinc-50"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
            background: "var(--bg-card)",
          }}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <title>Back icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Selection
        </Link>

        {firstRound ? (
          <Link
            href={`/preparation/company/${id}/${firstRound.id}`}
            className="px-6 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 text-center"
            style={{ background: "var(--accent)" }}
          >
            Start →
          </Link>
        ) : (
          <button
            disabled
            className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-zinc-400 cursor-not-allowed"
          >
            No Rounds Available
          </button>
        )}
      </div>

      {/* Header Info */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl gap-4 bg-white border"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0 border bg-zinc-50 overflow-hidden p-1.5"
            style={{ borderColor: "var(--border)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.icon}
              alt={config.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {config.name} Placement Track
            </h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              MBA Placement Track · {config.rounds ? config.rounds.length : 0} stages
            </p>
          </div>
        </div>
      </div>

      {/* Reusable Rounds Progress List Component */}
      {config.rounds && config.rounds.length > 0 ? (
        <CompanyRoundsList companyId={id} config={config} />
      ) : (
        <div className="py-12 text-center border-2 border-dashed rounded-2xl bg-white" style={{ borderColor: "var(--border)" }}>
          <p className="text-zinc-500 text-sm">No interview rounds configured for this company yet.</p>
        </div>
      )}

      {/* Past Sessions */}
      {sessions.length > 0 && (
        <div className="mt-10 animate-fade-in">
          <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Past Interview Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sessions.map((session, idx) => (
              <div key={session.id} className="p-5 rounded-2xl bg-white border flex items-center justify-between shadow-sm transition-all hover:shadow-md" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="text-sm font-bold text-zinc-900">Session #{sessions.length - idx}</p>
                  <p className="text-xs text-zinc-500 mt-1">Score: <span className="font-bold text-emerald-600">{session.overall_score}%</span></p>
                </div>
                <Link
                  href={`/preparation/company/${id}/analysis?session=${session.id}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
