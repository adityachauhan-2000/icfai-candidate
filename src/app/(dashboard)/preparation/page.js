"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PreparationPage() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/preparation/companies`);
        if (!res.ok) throw new Error("Failed to load companies");
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Company Placement Prep
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Select a company to practice their exact custom recruitment rounds under real timed conditions.
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
  );
}
