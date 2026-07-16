"use client";

import { Sparkles } from "lucide-react";

export default function ConnectStudentsPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[40rem] h-[40rem] bg-zinc-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-900/20 transform hover:scale-105 transition-transform duration-300">
          <Sparkles className="w-8 h-8" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
          Coming Soon
        </h1>
      </div>
    </div>
  );
}
