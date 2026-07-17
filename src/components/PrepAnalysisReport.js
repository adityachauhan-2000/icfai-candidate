"use client";

import { CircularScore } from "@/data/preparation";
import Image from "next/image";

export default function PrepAnalysisReport({
  company,
  analysisResult,
  onRestart,
  isolatedRoundType,
}) {
  if (!analysisResult) {
    return <div className="text-center py-10">No analysis data available.</div>;
  }

  if (analysisResult.error) {
    return (
      <div className="text-center py-10 text-red-600 font-semibold">
        Error processing analysis: {analysisResult.error}
      </div>
    );
  }

  const { overall_score, aptitude_score, gd_analysis, interview_analysis } = analysisResult;
  const report = interview_analysis?.report || {};

  const scorePercent = overall_score || 0;
  const aptScore = aptitude_score?.total > 0 ? Math.round((aptitude_score.correct / aptitude_score.total) * 100) : 0;
  const improvements = report.improvements || [];
  const feedback_summary = report.feedback_summary || "No general feedback available.";

  const gdQuestion = gd_analysis?.question || "No GD question provided.";
  const gdFeedback = report.gd_feedback || "No specific GD evaluation available.";
  const gdTranscript = gd_analysis?.transcript || "No transcript recorded.";
  const posture = report.posture_behavior_feedback || gd_analysis?.posture || "No video posture analysis available.";

  const intQuestion = interview_analysis?.question || "No personal interview question provided.";
  const intFeedback = report.interview_feedback || "No specific Interview evaluation available.";
  const transcript = interview_analysis?.transcript || "No transcript recorded.";
  const grammar = report.grammar_pronunciation_notes || "No speech notes.";

  const companyName = company?.name || "Company";
  const iconSrc = company?.id === 999 ? null : (company?.icon || null);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in pb-20">
      {/* Top Banner */}
      <div
        className="p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, var(--bg-card), #ffffff)",
          border: "1px solid var(--border-purple)",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)"
        }}
      >
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 mb-4">
            {iconSrc ? (
              <div className="w-12 h-12 rounded-xl p-2 bg-white shadow-sm border border-zinc-100 flex items-center justify-center">
                <img src={iconSrc} alt={companyName} className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <span className="text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600">
                Self Practice Report
              </span>
            )}
            <span
              className="text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg"
              style={{ background: "var(--accent-pale)", color: "var(--accent)" }}
            >
              Final Results
            </span>
          </div>

          <h1
            className="text-3xl font-black tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {company?.id === 999 ? "Self Preparation Report" : `${companyName} Interview Analysis`}
          </h1>
          <p
            className="text-sm mt-3 leading-relaxed font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {feedback_summary}
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-zinc-100 min-w-[160px]">
          <p
            className="text-[10px] uppercase font-bold tracking-widest mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Overall AI Score
          </p>
          <CircularScore score={scorePercent} size={90} color="var(--accent)" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* ROUND 1: APTITUDE ASSESSMENT */}
          {(!isolatedRoundType || isolatedRoundType === "aptitude") && (
            <div className="p-7 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-5 relative overflow-hidden group hover:border-zinc-300 transition-all">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  Round 1: Aptitude Assessment
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${(aptitude_score?.correct || 0) <= 10 ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${(aptitude_score?.correct || 0) <= 10 ? 'text-red-800' : 'text-emerald-800'}`}>Aptitude Score</p>
                  <p className={`text-2xl font-black ${(aptitude_score?.correct || 0) <= 10 ? 'text-red-950' : 'text-emerald-950'}`}>{aptitude_score?.correct || 0} / 60</p>
                  <p className={`text-xs mt-1 ${(aptitude_score?.correct || 0) <= 10 ? 'text-red-700' : 'text-emerald-700'}`}>Each correct answer is worth 1 point</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Questions Attempted</p>
                  <p className="text-2xl font-black text-zinc-800">{aptitude_score?.attempted || 0} / 60</p>
                  <p className="text-xs text-zinc-500 mt-1">Accuracy: {aptitude_score?.attempted > 0 ? Math.round((aptitude_score.correct / aptitude_score.attempted) * 100) : 0}%</p>
                </div>
              </div>
            </div>
          )}

          {/* ROUND 2: GD */}
          {(!isolatedRoundType || isolatedRoundType === "gd") && (
            <div className="p-7 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-5 relative overflow-hidden group hover:border-zinc-300 transition-all">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  Round 2: Audio Preparation
                </h2>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Topic Assigned</p>
                <p className="text-sm font-medium text-blue-950">{gdQuestion}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Performance Feedback</p>
                <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-2xl border border-zinc-100">{gdFeedback}</p>
              </div>
            </div>
          )}

          {/* ROUND 3: INTERVIEW */}
          {(!isolatedRoundType || isolatedRoundType === "interview" || isolatedRoundType === "hr") && (
            <div className="p-7 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-5 relative overflow-hidden group hover:border-zinc-300 transition-all">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  Round 3: Personal Interview
                </h2>
              </div>


              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Response Evaluation</p>
                <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-2xl border border-zinc-100">{intFeedback}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Grammar & Fluency</p>
                  <p className="text-sm text-zinc-700 leading-relaxed italic border-l-2 border-purple-300 pl-4 mb-4">{grammar}</p>

                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Visual & Behavior Analysis</p>
                  <p className="text-sm text-zinc-700 leading-relaxed italic border-l-2 border-blue-300 pl-4">{posture}</p>
                </div>
              </div>
            </div>
          )}


        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">

          <div className="p-7 rounded-3xl bg-amber-50 border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-lg font-black text-amber-900 tracking-tight">Areas to Improve</h2>
            </div>
            <ul className="space-y-3">
              {improvements.map((item, idx) => (
                <li key={idx} className="text-sm text-amber-900 leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
              {improvements.length === 0 && <li className="text-sm text-amber-800">No specific improvements found.</li>}
            </ul>
          </div>

          <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-3xl">
            <button
              type="button"
              onClick={onRestart}
              className="w-full px-6 py-4 text-sm font-bold rounded-2xl text-white transition-all hover:-translate-y-1 hover:shadow-lg shadow-md"
              style={{ background: "var(--accent)" }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
