"use client";

import Image from "next/image";
import Link from "next/link";
import eyIcon from "@/app/Assets/company/ev.png";
import googleIcon from "@/app/Assets/company/google.png";
import facebookIcon from "@/app/Assets/company/meta.png";
import tcsIcon from "@/app/Assets/company/tcs.png";

const companies = [
  {
    id: "facebook",
    name: "Facebook",
    logoColor: "#1877f2",
    accentColor: "#1877f2",
    icon: facebookIcon,
  },
  {
    id: "google",
    name: "Google",
    logoColor: "#ea4335",
    accentColor: "#ea4335",
    icon: googleIcon,
  },
  {
    id: "ey",
    name: "EY",
    logoColor: "#ffe600",
    textColor: "#000000",
    accentColor: "#ca8a04",
    icon: eyIcon,
  },
  {
    id: "tcs",
    name: "TCS",
    logoColor: "#005a9c",
    accentColor: "#005a9c",
    icon: tcsIcon,
  },
];

export default function PlacementPrepPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Company Placement Prep
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Select a company to practice their exact custom recruitment rounds under real timed conditions.
        </p>
      </div>

      {/* Directory Grid with small square boxes linking to /preparation/[companyId] */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/preparation/${company.id}`}
            className="group aspect-square rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-200 hover:shadow-sm hover:border-zinc-400 border cursor-pointer text-center bg-white"
            style={{
              borderColor: "var(--border)",
            }}
          >
            {/* Minimal Logo box */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 border bg-zinc-50 overflow-hidden p-1.5"
              style={{
                borderColor: "var(--border)",
              }}
            >
              <Image
                src={company.icon}
                alt={company.name}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>

            {/* Company Name */}
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {company.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
