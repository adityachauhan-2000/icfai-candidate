"use client";

import { Suspense, useEffect, useState } from "react";
import { RoundPageContent } from "../company/[id]/[roundId]/page";

export default function AptitudePage() {
  const [roundId, setRoundId] = useState(null);

  useEffect(() => {
    async function getAptitudeRoundId() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/companies/999`);
        if (res.ok) {
          const company = await res.json();
          const aptRound = company.rounds?.find(r => r.type === "aptitude");
          if (aptRound) {
            setRoundId(String(aptRound.id));
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setRoundId("14"); // Fallback ID
    }
    getAptitudeRoundId();
  }, []);

  if (!roundId) {
    return (
      <div className="p-10 text-center text-sm text-zinc-500 font-semibold">
        Loading Aptitude Test...
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-sm text-zinc-500">
          Loading Aptitude Test...
        </div>
      }
    >
      <RoundPageContent id="999" roundId={roundId} isolatedMode={true} basePath="/preparation/aptitude" />
    </Suspense>
  );
}
