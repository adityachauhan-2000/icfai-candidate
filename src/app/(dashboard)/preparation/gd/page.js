"use client";

import { Suspense, useEffect, useState } from "react";
import { RoundPageContent } from "../company/[id]/[roundId]/page";

export default function GDPage() {
  const [roundId, setRoundId] = useState(null);

  useEffect(() => {
    async function getGdRoundId() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/companies/999`);
        if (res.ok) {
          const company = await res.json();
          const gdRound = company.rounds?.find(r => r.type === "gd");
          if (gdRound) {
            setRoundId(String(gdRound.id));
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setRoundId("15"); // Fallback ID
    }
    getGdRoundId();
  }, []);

  if (!roundId) {
    return (
      <div className="p-10 text-center text-sm text-zinc-500 font-semibold">
        Loading Topic Preparation...
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-sm text-zinc-500">
          Loading Topic Preparation...
        </div>
      }
    >
      <RoundPageContent id="999" roundId={roundId} isolatedMode={true} basePath="/preparation/gd" />
    </Suspense>
  );
}
