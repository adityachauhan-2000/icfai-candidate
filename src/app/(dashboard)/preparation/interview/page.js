"use client";

import { Suspense, useEffect, useState } from "react";
import { RoundPageContent } from "../company/[id]/[roundId]/page";

export default function InterviewPage() {
  const [roundId, setRoundId] = useState(null);

  useEffect(() => {
    async function getInterviewRoundId() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/companies/999`);
        if (res.ok) {
          const company = await res.json();
          const interviewRound = company.rounds?.find(r => r.type === "interview" || r.type === "hr");
          if (interviewRound) {
            setRoundId(String(interviewRound.id));
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setRoundId("16"); // Fallback ID
    }
    getInterviewRoundId();
  }, []);

  if (!roundId) {
    return (
      <div className="p-10 text-center text-sm text-zinc-500 font-semibold">
        Loading Interview session...
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-sm text-zinc-500">
          Loading Interview...
        </div>
      }
    >
      <RoundPageContent id="999" roundId={roundId} isolatedMode={true} basePath="/preparation/interview" />
    </Suspense>
  );
}
