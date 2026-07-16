"use client";

import { useEffect, useRef, useState } from "react";

const questions = [
  {
    id: 1,
    round: "HR Round",
    role: "Software Engineer",
    question:
      "Tell me about yourself and your journey into software development.",
    tip: "Use the Present-Past-Future structure: who you are now, key experiences, and where you're headed.",
    timeLimit: 120,
  },
  {
    id: 2,
    round: "HR Round",
    role: "Software Engineer",
    question:
      "Tell me about a time you had to work under pressure and meet a tight deadline.",
    tip: "Structure your answer with the STAR method — situation, task, action, result. Be specific with numbers.",
    timeLimit: 120,
  },
  {
    id: 3,
    round: "Technical Round",
    role: "Software Engineer",
    question:
      "Explain the difference between process and thread. When would you use one over the other?",
    tip: "Start with the definition, then compare. Mention real-world use cases like web servers vs. background tasks.",
    timeLimit: 90,
  },
  {
    id: 4,
    round: "HR Round",
    role: "Software Engineer",
    question: "Where do you see yourself in 5 years?",
    tip: "Be honest but align with the company's growth path. Show ambition without overselling.",
    timeLimit: 90,
  },
  {
    id: 5,
    round: "Technical Round",
    role: "Software Engineer",
    question:
      "What is object-oriented programming? Explain the four pillars with examples.",
    tip: "Mention encapsulation, inheritance, polymorphism, and abstraction. Use a real-world analogy for each.",
    timeLimit: 120,
  },
];

const feedbackTemplates = [
  {
    score: 85,
    strengths: [
      "Clear structure in your response",
      "Good use of specific examples",
      "Confident delivery",
    ],
    improvements: [
      "Could expand on the outcome/result section",
      "Add quantifiable impact to make it stronger",
    ],
    overall:
      "Strong answer. The structure was clear and examples were relevant. Focus on quantifying your impact next time.",
  },
  {
    score: 72,
    strengths: ["Relevant content covered", "Good starting point"],
    improvements: [
      "Response lacked concrete examples",
      "Answer felt rushed — slow down and breathe",
      "Missing the 'Result' part of STAR",
    ],
    overall:
      "Decent attempt but needs more depth. Prepare 2-3 specific stories you can adapt for different questions.",
  },
  {
    score: 91,
    strengths: [
      "Excellent use of STAR framework",
      "Very specific and measurable results",
      "Natural and confident tone",
    ],
    improvements: ["Slightly long — aim to wrap up within 90 seconds"],
    overall:
      "Excellent response. The specificity of your examples is impressive. Just tighten the ending.",
  },
];

export default function AIInterviewPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [phase, setPhase] = useState("ready"); // ready | recording | done | feedback
  const [timeLeft, setTimeLeft] = useState(0);
  const [wavePhase, setWavePhase] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const timerRef = useRef(null);
  const waveRef = useRef(null);

  const question = questions[currentQ];
  const feedback = feedbackTemplates[currentQ % feedbackTemplates.length];

  // Wave animation
  useEffect(() => {
    if (phase === "recording") {
      waveRef.current = setInterval(() => {
        setWavePhase((p) => (p + 1) % 100);
      }, 80);
    } else {
      clearInterval(waveRef.current);
    }
    return () => clearInterval(waveRef.current);
  }, [phase]);

  // Timer countdown
  useEffect(() => {
    if (phase === "recording") {
      setTimeLeft(question.timeLimit);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setPhase("done");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, question.timeLimit]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const startRecording = () => setPhase("recording");

  const stopRecording = () => {
    clearInterval(timerRef.current);
    setPhase("feedback");
    setHistory((h) => [
      { ...question, score: feedback.score, answeredAt: "Just now" },
      ...h,
    ]);
  };

  const skipQuestion = () => {
    clearInterval(timerRef.current);
    setPhase("ready");
    setCurrentQ((q) => (q + 1) % questions.length);
  };

  const nextQuestion = () => {
    setPhase("ready");
    setCurrentQ((q) => (q + 1) % questions.length);
  };

  const retryQuestion = () => setPhase("ready");

  const waveHeights = Array.from({ length: 20 }, (_, i) =>
    phase === "recording"
      ? Math.abs(Math.sin((i + wavePhase) * 0.4)) * 28 + 4
      : 4,
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* History toggle */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {question.round} · {question.role}
          </p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
          style={{
            background: "var(--accent-pale)",
            color: "var(--accent)",
            border: "1px solid var(--border-purple)",
          }}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          History
        </button>
      </div>
      {/* History panel */}
      {showHistory && (
        <div
          className="mb-6 rounded-2xl p-4"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Question History
          </p>
          {history.length === 0
            ? <p
                className="text-sm text-center py-4"
                style={{ color: "var(--text-muted)" }}
              >
                No questions answered yet. Start your first round!
              </p>
            : <div className="flex flex-col gap-2">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "var(--bg-main)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{
                        background: "var(--accent-pale)",
                        color: "var(--accent)",
                      }}
                    >
                      Q{h.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {h.question}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {h.round} · {h.answeredAt}
                      </p>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-lg shrink-0"
                      style={{
                        background:
                          h.score >= 80 ? "#d1fae5" : "var(--accent-pale)",
                        color: h.score >= 80 ? "#065f46" : "var(--accent)",
                      }}
                    >
                      {h.score}/100
                    </span>
                  </div>
                ))}
              </div>}
        </div>
      )}

      {/* Progress bar */}
      <div className="flex gap-1.5 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full transition-all"
            style={{
              background:
                i < currentQ
                  ? "var(--accent)"
                  : i === currentQ
                    ? "var(--accent-light)"
                    : "var(--border)",
            }}
          />
        ))}
      </div>
      <p className="text-xs mb-6" style={{ color: "var(--text-secondary)" }}>
        Question {currentQ + 1} of {questions.length}
      </p>

      {/* Question card */}
      <div
        className="rounded-2xl p-6 mb-5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <p
          className="text-lg font-semibold leading-relaxed"
          style={{ color: "var(--text-primary)" }}
        >
          "{question.question}"
        </p>
      </div>

      {/* Recording zone */}
      {(phase === "ready" || phase === "recording" || phase === "done") && (
        <>
          <div
            className="rounded-2xl p-6 mb-4 flex flex-col items-center gap-4"
            style={{
              background: "var(--bg-main)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Mic button */}
            <button
              onClick={phase === "ready" ? startRecording : undefined}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
              style={{
                background:
                  phase === "recording"
                    ? "var(--accent)"
                    : "var(--text-primary)",
                boxShadow:
                  phase === "recording"
                    ? "0 0 0 8px var(--accent-soft)"
                    : "none",
              }}
              aria-label={phase === "ready" ? "Start recording" : "Recording"}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>

            {/* Waveform */}
            <div className="flex items-center gap-1 h-10">
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full transition-all duration-75"
                  style={{
                    height: `${h}px`,
                    background:
                      phase === "recording" ? "var(--accent)" : "var(--border)",
                  }}
                />
              ))}
            </div>

            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {phase === "ready" && "Click the mic to start recording"}
              {phase === "recording" &&
                `Listening · speak naturally, AI is recording · ${formatTime(timeLeft)} left`}
              {phase === "done" && "Time's up — recording stopped"}
            </p>
          </div>

          {/* Live tip */}
          {(phase === "recording" || phase === "ready") && (
            <div
              className="rounded-xl px-4 py-3 mb-5 flex items-start gap-3"
              style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#d97706"
                strokeWidth={2}
                className="mt-0.5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#92400e" }}
              >
                <span className="font-semibold">Live tip: </span>
                {question.tip}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={skipQuestion}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Skip question
            </button>
            <button
              onClick={stopRecording}
              disabled={phase === "ready"}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background:
                  phase === "ready" ? "var(--border)" : "var(--text-primary)",
                color: phase === "ready" ? "var(--text-muted)" : "#fff",
                cursor: phase === "ready" ? "not-allowed" : "pointer",
              }}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Done answering
            </button>
          </div>
        </>
      )}

      {/* Feedback phase */}
      {phase === "feedback" && (
        <div className="flex flex-col gap-4">
          {/* Score banner */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{
              background: "var(--accent-pale)",
              border: "1px solid var(--border-purple)",
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-xl font-bold"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {feedback.score}
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Score: {feedback.score}/100
              </p>
              <p
                className="text-xs mt-0.5 leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {feedback.overall}
              </p>
            </div>
          </div>

          {/* Strengths */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-sm font-semibold mb-3"
              style={{ color: "#065f46" }}
            >
              ✅ Strengths
            </p>
            <ul className="flex flex-col gap-2">
              {feedback.strengths.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span className="mt-0.5 text-green-500">•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-sm font-semibold mb-3"
              style={{ color: "#b45309" }}
            >
              🔧 Areas to improve
            </p>
            <ul className="flex flex-col gap-2">
              {feedback.improvements.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span className="mt-0.5 text-amber-500">•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={retryQuestion}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-purple)",
                color: "var(--accent)",
              }}
            >
              Retry this question
            </button>
            <button
              onClick={nextQuestion}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Next question →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
