"use client";

import { useEffect, useState } from "react";

export default function CompanyRoundsList({ companyId, config }) {
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState({});

  useEffect(() => {
    try {
      const storedAnswers = localStorage.getItem(`answers_${companyId}`);
      const storedSkipped = localStorage.getItem(`skipped_${companyId}`);
      if (storedAnswers) setAnswers(JSON.parse(storedAnswers));
      if (storedSkipped) setSkipped(JSON.parse(storedSkipped));
    } catch (e) {
      console.error("Error reading progress", e);
    }
  }, [companyId]);

  const rounds = config.rounds;
  const completedCount = rounds.filter(
    (round) =>
      answers[round.id] &&
      answers[round.id] !== "No response written" &&
      answers[round.id] !== "No answer selected" &&
      answers[round.id] !== "No input provided" &&
      !skipped[round.id],
  ).length;

  const _skippedCount = rounds.filter((round) => skipped[round.id]).length;
  const _progressPercent = Math.round((completedCount / rounds.length) * 100);

  return (
    <div className="space-y-6">
      {/* Rounds list tabs */}
      <div className="space-y-3">
        <h3
          className="text-sm font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Stages Hierarchy
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {rounds.map((round, idx) => {
            const _isDone =
              answers[round.id] &&
              answers[round.id] !== "No response written" &&
              answers[round.id] !== "No answer selected" &&
              answers[round.id] !== "No input provided" &&
              !skipped[round.id];
            const _isSkipped = skipped[round.id];

            return (
              <div
                key={round.id}
                className="flex items-center justify-between p-4 rounded-xl border bg-white"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border"
                    style={{
                      background: "var(--bg-main)",
                      color: "var(--text-secondary)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <h4
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {round.label}
                    </h4>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {round.timeLimit / 60} minutes
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
