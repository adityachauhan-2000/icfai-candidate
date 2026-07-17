"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import PrepAnalysisReport from "@/components/PrepAnalysisReport";


// Helper to get Blob from IndexedDB
const getBlobFromDB = (key) => {
  return new Promise((resolve) => {
    const req = indexedDB.open("InterviewDB", 3);
    req.onsuccess = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("blobs")) return resolve(null);
      const tx = db.transaction("blobs", "readonly");
      const store = tx.objectStore("blobs");
      const getReq = store.get(key);
      getReq.onsuccess = () => resolve(getReq.result);
      getReq.onerror = () => resolve(null);
    };
    req.onerror = () => resolve(null);
  });
};

export function AnalysisPageContent({ id, basePath = `/preparation/company/${id}/analysis`, isolatedRoundType = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/companies/${id}`);
        if (res.ok) {
          setCompany(await res.json());
        } else if (id === "999") {
          setCompany({ id: 999, name: "Self Preparation" });
        }
      } catch (e) {
        if (id === "999") setCompany({ id: 999, name: "Self Preparation" });
      }
    }
    fetchCompany();
  }, [id]);

  useEffect(() => {
    async function processAnalysis() {
      try {
        if (sessionId) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/sessions/detail/${sessionId}`, {
            credentials: "include"
          });
          if (res.ok) {
            setAnalysisResult(await res.json());
          } else {
            setAnalysisResult({ error: "Session not found" });
          }
          setLoading(false);
          return;
        }

        const storedAnswersStr = localStorage.getItem(`answers_${id}`);

        if (!storedAnswersStr) {
          // If no current session answers exist, fetch the latest completed session
          try {
            const sessionsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/sessions/${id}`, {
              credentials: "include"
            });
            if (sessionsRes.ok) {
              const sessions = await sessionsRes.json();
              if (sessions && sessions.length > 0) {
                setAnalysisResult(sessions[0]);
                setLoading(false);
                return;
              }
            }
          } catch (e) {
            console.error("Error fetching latest session", e);
          }
          if (basePath.includes("analysis")) {
            router.replace(`/preparation/company/${id}`);
          } else {
            setLoading(false); // Let it handle gracefully if no session
          }
          return;
        }

        const storedAnswers = JSON.parse(storedAnswersStr);

        let aptitudeScoreStr = "{}";
        let gdQuestion = "";
        let interviewQuestion = "";
        Object.keys(storedAnswers).forEach(key => {
          try {
            const parsed = JSON.parse(storedAnswers[key]);
            if (parsed.score) {
              aptitudeScoreStr = JSON.stringify(parsed.score);
            }
            if (parsed.type === "gd") {
              gdQuestion = parsed.question || "";
            }
            if (parsed.type === "interview") {
              interviewQuestion = parsed.question || "";
            }
          } catch (e) { }
        });

        const gdAudioBlob = await getBlobFromDB(`gd_audio_${id}`);
        const interviewVideoBlob = await getBlobFromDB(`interview_video_${id}`);

        let activeStudentId = 1;
        try {
          const token = localStorage.getItem("student_token");
          const headers = {};
          if (token) headers["Authorization"] = `Bearer ${token}`;
          const stRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/auth/student/me`, {
            headers,
            credentials: "include"
          });
          if (stRes.ok) {
            const stData = await stRes.json();
            activeStudentId = stData.id;
          }
        } catch (e) {
          console.error(e);
        }

        const formData = new FormData();
        formData.append("company_id", id);
        formData.append("student_id", activeStudentId);
        formData.append("aptitude_score", aptitudeScoreStr);
        formData.append("gd_question_text", gdQuestion);
        formData.append("interview_question_text", interviewQuestion);
        if (gdAudioBlob) formData.append("gd_audio", gdAudioBlob, "gd_audio.webm");
        if (interviewVideoBlob) formData.append("interview_video", interviewVideoBlob, "interview_video.webm");

        const token = localStorage.getItem("student_token");
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/analyze-interview`, {
          method: "POST",
          headers,
          credentials: "include",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setAnalysisResult(data);

          try {
            localStorage.removeItem(`answers_${id}`);
            localStorage.removeItem(`skipped_${id}`);
          } catch (e) { }

          router.replace(`${basePath}?session=${data.id}`);
        } else {
          setAnalysisResult({ error: "Failed to fetch analysis" });
        }
      } catch (e) {
        console.error("Error fetching analysis", e);
        setAnalysisResult({ error: e.message });
      } finally {
        setLoading(false);
      }
    }
    processAnalysis();
  }, [id, sessionId, router, basePath]);

  const handleRestart = () => {
    try {
      localStorage.removeItem(`answers_${id}`);
      localStorage.removeItem(`skipped_${id}`);
    } catch (e) { }
    router.push("/preparation");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          {/* Inner spinning gradient ring */}
          <div className="relative w-24 h-24 rounded-full border-4 border-zinc-100 flex items-center justify-center shadow-2xl overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-500 animate-spin" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%)' }}></div>
            <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </div>

        <h3 className="mt-8 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 animate-pulse">
          Analyzing Your Session
        </h3>
        <p className="mt-3 text-sm text-zinc-500 max-w-sm text-center leading-relaxed">
          Our AI is evaluating your responses, processing data, and generating personalized feedback. This usually takes a minute.
        </p>

        <div className="mt-8 w-64 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-1/2 animate-[progress_2s_ease-in-out_infinite_alternate] rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 animate-fade-in">
      <PrepAnalysisReport
        company={company}
        analysisResult={analysisResult}
        onRestart={handleRestart}
        isolatedRoundType={isolatedRoundType}
      />
    </div>
  );
}

export default function AnalysisPage({ params }) {
  const { id } = use(params);
  return <AnalysisPageContent id={id} />;
}
