"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import eyIcon from "@/app/Assets/company/ev.png";
import googleIcon from "@/app/Assets/company/google.png";
import facebookIcon from "@/app/Assets/company/meta.png";
import tcsIcon from "@/app/Assets/company/tcs.png";
import { formatTime } from "@/data/preparation";

// Predefined company round configs
export const COMPANY_CONFIGS = {
  facebook: {
    name: "Facebook",
    logoColor: "#1877f2",
    logoText: "f",
    icon: facebookIcon,
    rounds: [
      {
        id: "interview",
        label: "Interview",
        timeLimit: 2700,
        type: "interview",
        description: "Design a scalable news feed service for 1 billion users.",
      },
      {
        id: "hr",
        label: "HR Round",
        timeLimit: 1800,
        type: "hr",
        description:
          "Tell me about a time you resolved a conflict with a peer.",
      },
    ],
  },
  google: {
    name: "Google",
    logoColor: "#ea4335",
    logoText: "G",
    icon: googleIcon,
    rounds: [
      {
        id: "interview",
        label: "Interview",
        timeLimit: 2700,
        type: "interview",
        description:
          "Explain how you would optimize search indexing latency under heavy traffic.",
      },
      {
        id: "hr",
        label: "HR Round",
        timeLimit: 1800,
        type: "hr",
        description:
          "Describe a situation where you had to lead a project with incomplete specifications.",
      },
    ],
  },
  ey: {
    name: "EY",
    logoColor: "#ffe600",
    logoText: "EY",
    textColor: "#000000",
    icon: eyIcon,
    rounds: [
      {
        id: "aptitude",
        label: "Aptitude Assessment",
        timeLimit: 1800,
        type: "aptitude",
        description: "Logical reasoning and quantitative analysis test.",
      },
      {
        id: "gd",
        label: "Topic Preparation",
        timeLimit: 1800,
        type: "gd",
        description:
          "Topic: Is artificial intelligence a threat to creative B-school jobs?",
      },
      {
        id: "hr",
        label: "HR Round",
        timeLimit: 1800,
        type: "hr",
        description:
          "Why do you want to join EY Consulting and how do you handle high-pressure deadlines?",
      },
    ],
  },
  tcs: {
    name: "TCS",
    logoColor: "#005a9c",
    logoText: "TCS",
    icon: tcsIcon,
    rounds: [
      {
        id: "aptitude",
        label: "Aptitude Assessment",
        timeLimit: 1800,
        type: "aptitude",
        description:
          "Quantitative MCQs covering speed, distance, probability and reasoning.",
      },
      {
        id: "interview",
        label: "Interview",
        timeLimit: 1800,
        type: "interview",
        description:
          "Explain the difference between SQL and NoSQL databases, and when to use which.",
      },
      {
        id: "hr",
        label: "HR Round",
        timeLimit: 1800,
        type: "hr",
        description:
          "Describe your final year project, your contribution, and technical challenges faced.",
      },
    ],
  },
};

export default function CompanyPrepFlow({
  companyId,
  onComplete,
  onBackToSelection,
}) {
  const config = COMPANY_CONFIGS[companyId];
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const currentRound = config.rounds[currentRoundIdx];
  const [timeLeft, setTimeLeft] = useState(currentRound?.timeLimit || 1800);
  const [answers, setAnswers] = useState({});
  const [skippedRounds, setSkippedRounds] = useState({});

  // Aptitude state
  const [aptSelectedOpt, setAptSelectedOpt] = useState(null);

  // GD state
  const [gdMessages, setGdMessages] = useState([
    {
      sender: "Moderator",
      text: "Welcome to the GD. The topic is: 'Is artificial intelligence a threat to creative B-school jobs?'. You have 3 minutes to present your points. Priya, please start.",
      time: "12:00",
    },
  ]);
  const [gdInputValue, setGdInputValue] = useState("");

  // Keep track of active timer
  useEffect(() => {
    setTimeLeft(currentRound.timeLimit);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentRound]);

  // Simulated GD participants responses
  useEffect(() => {
    if (currentRound.type === "gd" && gdMessages.length === 1) {
      const t1 = setTimeout(() => {
        setGdMessages((prev) => [
          ...prev,
          {
            sender: "Priya",
            text: "I believe AI acts as a co-pilot rather than a replacement. It helps automate routine analysis so we can focus on strategic decisions.",
            time: "11:50",
          },
        ]);
      }, 3000);

      const t2 = setTimeout(() => {
        setGdMessages((prev) => [
          ...prev,
          {
            sender: "Rohan",
            text: "But what about entry-level roles? Copywriting, basic market research, and presentations are already being automated entirely.",
            time: "11:40",
          },
        ]);
      }, 7000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [currentRound, gdMessages]);

  const handleNext = () => {
    // Save current answer
    const newAnswers = { ...answers };
    if (currentRound.type === "aptitude") {
      newAnswers[currentRound.id] =
        aptSelectedOpt !== null ? aptSelectedOpt : "No answer selected";
    } else if (currentRound.type === "gd") {
      newAnswers[currentRound.id] =
        gdMessages
          .filter((m) => m.sender === "You")
          .map((m) => m.text)
          .join(" | ") || "No input provided";
    } else {
      newAnswers[currentRound.id] =
        answers[currentRound.id] || "No response written";
    }
    setAnswers(newAnswers);

    if (currentRoundIdx < config.rounds.length - 1) {
      setCurrentRoundIdx(currentRoundIdx + 1);
      setAptSelectedOpt(null);
    } else {
      // Completed all rounds
      onComplete(newAnswers, skippedRounds);
    }
  };

  const handleBack = () => {
    if (currentRoundIdx > 0) {
      setCurrentRoundIdx(currentRoundIdx - 1);
    } else {
      onBackToSelection();
    }
  };

  const handleSkip = () => {
    setSkippedRounds({ ...skippedRounds, [currentRound.id]: true });

    if (currentRoundIdx < config.rounds.length - 1) {
      setCurrentRoundIdx(currentRoundIdx + 1);
      setAptSelectedOpt(null);
    } else {
      onComplete(answers, { ...skippedRounds, [currentRound.id]: true });
    }
  };

  const sendGdMessage = () => {
    if (!gdInputValue.trim()) return;
    setGdMessages((prev) => [
      ...prev,
      { sender: "You", text: gdInputValue, time: "11:30" },
    ]);
    setGdInputValue("");

    // Simulate moderator or Kavya response
    setTimeout(() => {
      setGdMessages((prev) => [
        ...prev,
        {
          sender: "Kavya",
          text: "That is a great point. Integrating AI into B-school curriculum is the only way to ensure future readiness.",
          time: "11:20",
        },
      ]);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header Info */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl gap-4"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-purple)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 border bg-white overflow-hidden p-1"
            style={{
              borderColor: "var(--border)",
            }}
          >
            <Image
              src={config.icon}
              alt={config.name}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {config.name} Interview Preparation
            </h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              MBA Placement Track · {config.rounds.length} stages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 font-semibold text-sm">
          <svg
            className="w-4 h-4 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <title>Time Remaining</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="relative flex items-center justify-between">
          <div
            className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full"
            style={{ background: "var(--accent-pale)", zIndex: 1 }}
          />
          <div
            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full transition-all duration-300"
            style={{
              background: "var(--accent)",
              width: `${(currentRoundIdx / Math.max(1, config.rounds.length - 1)) * 100}%`,
              zIndex: 2,
            }}
          />

          {config.rounds.map((round, idx) => {
            const isCompleted = idx < currentRoundIdx;
            const isActive = idx === currentRoundIdx;
            return (
              <div
                key={round.id}
                className="relative flex flex-col items-center z-10"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300"
                  style={{
                    background: isActive
                      ? "var(--accent)"
                      : isCompleted
                        ? "var(--success)"
                        : "var(--bg-card)",
                    color:
                      isActive || isCompleted ? "#ffffff" : "var(--text-muted)",
                    border:
                      isActive || isCompleted
                        ? "none"
                        : "2px solid var(--border)",
                    boxShadow: isActive ? "0 0 12px rgba(0,0,0,0.15)" : "none",
                  }}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <span
                  className="absolute top-10 text-[10px] sm:text-xs font-semibold whitespace-nowrap"
                  style={{
                    color: isActive
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  }}
                >
                  {round.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-6" /> {/* spacer for labels */}
      </div>

      {/* Main Interactive Round Container */}
      <div
        className="p-6 rounded-2xl min-h-[300px] flex flex-col justify-between space-y-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-purple)",
        }}
      >
        <div>
          <span
            className="text-xs uppercase tracking-widest font-bold px-2.5 py-1 rounded-md"
            style={{ background: "var(--accent-pale)", color: "var(--accent)" }}
          >
            STAGE {currentRoundIdx + 1}: {currentRound.label}
          </span>
          <p
            className="mt-3 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {currentRound.description}
          </p>
        </div>

        {/* Aptitude UI */}
        {currentRound.type === "aptitude" && (
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl font-medium text-sm"
              style={{
                background: "var(--bg-main)",
                border: "1px solid var(--border)",
              }}
            >
              <strong>Question:</strong> A company&apos;s revenue increased by
              20% in Year 1 and then decreased by 10% in Year 2. What is the net
              percentage change in revenue over two years?
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                "10% Increase",
                "8% Increase",
                "12% Increase",
                "9% Decrease",
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAptSelectedOpt(option)}
                  className="w-full text-left p-3.5 rounded-xl border text-sm font-semibold transition-all hover:bg-zinc-50 cursor-pointer"
                  style={{
                    borderColor:
                      aptSelectedOpt === option
                        ? "var(--accent)"
                        : "var(--border)",
                    background:
                      aptSelectedOpt === option
                        ? "var(--accent-pale)"
                        : "transparent",
                    color:
                      aptSelectedOpt === option
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GD UI */}
        {currentRound.type === "gd" && (
          <div className="space-y-4">
            <div
              className="border rounded-xl p-4 h-60 overflow-y-auto flex flex-col gap-2.5 bg-zinc-50"
              style={{ borderColor: "var(--border)" }}
            >
              {gdMessages.map((msg, i) => (
                <div
                  key={`${msg.sender}-${i}`}
                  className={`flex flex-col max-w-[80%] ${msg.sender === "You" ? "self-end items-end" : "self-start items-start"}`}
                >
                  <span className="text-[10px] font-bold text-zinc-400 mb-0.5">
                    {msg.sender}
                  </span>
                  <div
                    className="p-3 rounded-2xl text-xs font-semibold"
                    style={{
                      background:
                        msg.sender === "You"
                          ? "var(--accent)"
                          : msg.sender === "Moderator"
                            ? "#f4f4f5"
                            : "#eff6ff",
                      color:
                        msg.sender === "You"
                          ? "#ffffff"
                          : msg.sender === "Moderator"
                            ? "#52525b"
                            : "#2563eb",
                      borderRadius:
                        msg.sender === "You"
                          ? "16px 16px 2px 16px"
                          : "16px 16px 16px 2px",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your response to build on the discussion..."
                value={gdInputValue}
                onChange={(e) => setGdInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendGdMessage()}
                className="flex-1 px-4 py-2 text-sm rounded-xl border focus:outline-none focus:border-zinc-500"
                style={{ borderColor: "var(--border)" }}
              />
              <button
                type="button"
                onClick={sendGdMessage}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={{ background: "var(--accent)" }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Interview UI */}
        {currentRound.type === "interview" && (
          <div className="space-y-3">
            <label
              htmlFor="tech-response"
              className="block text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Your response / Architectural outline:
            </label>
            <textarea
              id="tech-response"
              className="w-full h-40 p-4 rounded-xl border text-sm font-medium focus:outline-none focus:border-zinc-500"
              style={{ borderColor: "var(--border)", fontFamily: "monospace" }}
              placeholder="Outline your architectural solution, key database schemas, caching levels, API end-points or pseudo-code..."
              value={answers[currentRound.id] || ""}
              onChange={(e) =>
                setAnswers({ ...answers, [currentRound.id]: e.target.value })
              }
            />
          </div>
        )}

        {/* HR UI */}
        {currentRound.type === "hr" && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border bg-amber-50 border-amber-200 text-xs text-amber-800 flex gap-2 font-medium">
              <span>💡</span>
              <div>
                <strong>Interview Tip:</strong> Use the STAR methodology
                (Situation, Task, Action, Result). Quantify your achievements!
              </div>
            </div>
            <label htmlFor="hr-response" className="sr-only">
              HR Behavioral Response
            </label>
            <textarea
              id="hr-response"
              className="w-full h-40 p-4 rounded-xl border text-sm font-medium focus:outline-none focus:border-zinc-500"
              style={{ borderColor: "var(--border)" }}
              placeholder="Write your behavioral response here..."
              value={answers[currentRound.id] || ""}
              onChange={(e) =>
                setAnswers({ ...answers, [currentRound.id]: e.target.value })
              }
            />
          </div>
        )}

        {/* Navigation Action Panel */}
        <div
          className="flex justify-between items-center pt-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {/* <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 text-sm font-semibold rounded-xl border transition-all hover:bg-zinc-50 cursor-pointer"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            ← Back
          </button> */}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2 text-sm font-semibold rounded-xl border transition-all hover:bg-zinc-50 text-amber-600 border-amber-200 hover:border-amber-400 cursor-pointer"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90 cursor-pointer"
              style={{ background: "var(--accent)" }}
            >
              {currentRoundIdx === config.rounds.length - 1
                ? "Finish Prep →"
                : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
