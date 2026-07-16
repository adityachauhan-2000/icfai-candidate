"use client";

import { useState } from "react";

const questions = [
  {
    id: 1,
    title: "Draw a Triangle Pattern",
    difficulty: "Easy",
    description:
      "Write a program to print a right-angled triangle pattern with * symbols. The number of rows should be input by the user.",
    example: "Input: 5\nOutput:\n*\n**\n***\n****\n*****",
    starterCode: "// Write your code here\nfunction printTriangle(n) {\n  \n}",
    expectedPattern: ["Nested loops", "Proper spacing", "Edge cases handled"],
  },
  {
    id: 2,
    title: "Reverse a String",
    difficulty: "Easy",
    description:
      "Write a function that reverses a string without using built-in reverse methods.",
    example: 'Input: "hello"\nOutput: "olleh"',
    starterCode:
      "// Write your code here\nfunction reverseString(str) {\n  \n}",
    expectedPattern: [
      "Two-pointer approach",
      "String manipulation",
      "Time complexity O(n)",
    ],
  },
  {
    id: 3,
    title: "Fibonacci Series",
    difficulty: "Medium",
    description:
      "Print the first N numbers of the Fibonacci sequence. Optimize for time complexity.",
    example: "Input: 7\nOutput: 0 1 1 2 3 5 8",
    starterCode: "// Write your code here\nfunction fibonacci(n) {\n  \n}",
    expectedPattern: [
      "Iterative approach preferred",
      "No extra space O(1)",
      "Handles edge cases n=0, n=1",
    ],
  },
  {
    id: 4,
    title: "Check Prime Number",
    difficulty: "Easy",
    description:
      "Write a function to check whether a given number is prime or not.",
    example: "Input: 17\nOutput: true\n\nInput: 4\nOutput: false",
    starterCode: "// Write your code here\nfunction isPrime(n) {\n  \n}",
    expectedPattern: [
      "Optimized up to sqrt(n)",
      "Handles 0 and 1",
      "Clear logic",
    ],
  },
  {
    id: 5,
    title: "Find Maximum in Array",
    difficulty: "Easy",
    description:
      "Without using Math.max, find the maximum value in an unsorted array.",
    example: "Input: [3, 1, 9, 2, 7]\nOutput: 9",
    starterCode: "// Write your code here\nfunction findMax(arr) {\n  \n}",
    expectedPattern: [
      "Single pass O(n)",
      "No built-in max",
      "Empty array handled",
    ],
  },
  {
    id: 6,
    title: "Palindrome Check",
    difficulty: "Medium",
    description:
      "Check if a given string is a palindrome, ignoring spaces and case.",
    example: 'Input: "A man a plan a canal Panama"\nOutput: true',
    starterCode: "// Write your code here\nfunction isPalindrome(str) {\n  \n}",
    expectedPattern: [
      "Clean string first",
      "Two-pointer comparison",
      "Case insensitive",
    ],
  },
];

const difficultyConfig = {
  Easy: { bg: "#d1fae5", color: "#065f46" },
  Medium: { bg: "#fef3c7", color: "#92400e" },
  Hard: { bg: "#fee2e2", color: "#991b1b" },
};

const aiFeedbackTemplates = [
  {
    score: 78,
    passed: true,
    issues: [
      {
        type: "warning",
        message:
          "Loop starts at i=1 but edge case n=0 not handled — consider adding a guard clause.",
      },
      {
        type: "info",
        message:
          "Code structure is correct but variable names like 'i' and 'j' hurt readability. Use 'row' and 'col'.",
      },
      {
        type: "success",
        message: "Logic produces the correct output for all tested inputs.",
      },
    ],
    summary:
      "Your code runs correctly but needs better variable naming and edge case coverage. Good first attempt!",
  },
  {
    score: 55,
    passed: false,
    issues: [
      {
        type: "error",
        message:
          "Nested loop structure is incorrect — inner loop condition should be j <= i, not j < n.",
      },
      {
        type: "error",
        message:
          "Missing newline character after each row. Output will appear on one line.",
      },
      {
        type: "warning",
        message: "No return statement found — function returns undefined.",
      },
    ],
    summary:
      "The logic has structural errors. Review how nested loops work for pattern problems and check the loop boundaries.",
  },
  {
    score: 95,
    passed: true,
    issues: [
      {
        type: "success",
        message: "Excellent code structure with clear variable names.",
      },
      { type: "success", message: "Edge cases properly handled." },
      {
        type: "info",
        message:
          "Minor: you could use template literals instead of string concatenation for cleaner output.",
      },
    ],
    summary:
      "Outstanding solution! Clean, readable, and handles all edge cases. Minor style improvement possible but not required.",
  },
];

const issueIcons = {
  error: { icon: "✕", bg: "#fee2e2", color: "#991b1b" },
  warning: { icon: "⚠", bg: "#fef3c7", color: "#92400e" },
  info: { icon: "ℹ", bg: "#eff6ff", color: "#1e40af" },
  success: { icon: "✓", bg: "#d1fae5", color: "#065f46" },
};

export default function CodeTestPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [code, setCode] = useState(questions[0].starterCode);
  const [phase, setPhase] = useState("coding"); // coding | result
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const question = questions[currentQ];
  const diffCfg = difficultyConfig[question.difficulty];
  const feedback = aiFeedbackTemplates[currentQ % aiFeedbackTemplates.length];

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setPhase("result");
      setHistory((h) => [
        {
          ...question,
          code,
          score: feedback.score,
          passed: feedback.passed,
          submittedAt: "Just now",
        },
        ...h,
      ]);
    }, 1400);
  };

  const handleNext = () => {
    const next = (currentQ + 1) % questions.length;
    setCurrentQ(next);
    setCode(questions[next].starterCode);
    setPhase("coding");
  };

  const handleRetry = () => {
    setCode(question.starterCode);
    setPhase("coding");
  };

  const handleHistoryRetry = (item) => {
    const idx = questions.findIndex((q) => q.id === item.id);
    if (idx !== -1) {
      setCurrentQ(idx);
      setCode(item.code);
      setPhase("coding");
      setShowHistory(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top bar — history + question count */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Question {currentQ + 1} of {questions.length}
        </p>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
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
          History ({history.length})
        </button>
      </div>

      {/* Question nav pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {questions.map((q, i) => {
          const done = history.find((h) => h.id === q.id);
          return (
            <button
              key={i}
              onClick={() => {
                setCurrentQ(i);
                setCode(questions[i].starterCode);
                setPhase("coding");
              }}
              className="w-9 h-9 rounded-lg text-xs font-semibold transition-all"
              style={{
                background:
                  i === currentQ
                    ? "var(--accent)"
                    : done
                      ? done.passed
                        ? "#d1fae5"
                        : "#fee2e2"
                      : "var(--bg-card)",
                color:
                  i === currentQ
                    ? "#fff"
                    : done
                      ? done.passed
                        ? "#065f46"
                        : "#991b1b"
                      : "var(--text-secondary)",
                border: i === currentQ ? "none" : "1px solid var(--border)",
              }}
            >
              {i + 1}
            </button>
          );
        })}
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
            Test History
          </p>
          {history.length === 0
            ? <p
                className="text-sm text-center py-4"
                style={{ color: "var(--text-muted)" }}
              >
                No submissions yet.
              </p>
            : <div className="flex flex-col gap-2">
                {history.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "var(--bg-main)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.difficulty} · {item.submittedAt}
                      </p>
                      <pre
                        className="text-xs mt-1 truncate font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.code.slice(0, 60)}...
                      </pre>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{
                          background: item.passed ? "#d1fae5" : "#fee2e2",
                          color: item.passed ? "#065f46" : "#991b1b",
                        }}
                      >
                        {item.score}/100
                      </span>
                      <button
                        onClick={() => handleHistoryRetry(item)}
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{
                          background: "var(--accent-pale)",
                          color: "var(--accent)",
                          border: "1px solid var(--border-purple)",
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ))}
              </div>}
        </div>
      )}

      {/* Main layout: question + editor side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Question */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: diffCfg.bg, color: diffCfg.color }}
              >
                {question.difficulty}
              </span>
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "var(--accent-pale)",
                  color: "var(--accent)",
                }}
              >
                Q{question.id}
              </span>
            </div>
            <h2
              className="text-base font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {question.title}
            </h2>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              {question.description}
            </p>
            <div
              className="rounded-xl p-3"
              style={{
                background: "var(--bg-main)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Example
              </p>
              <pre
                className="text-xs font-mono whitespace-pre-wrap leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {question.example}
              </pre>
            </div>
          </div>

          {/* Expected patterns */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              AI will check for
            </p>
            <ul className="flex flex-col gap-1.5">
              {question.expectedPattern.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                    style={{ background: "var(--accent-light)" }}
                  >
                    {i + 1}
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Code editor */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {/* Editor top bar */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{
                background: "#1e1b4b",
                borderBottom: "1px solid #312e81",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs font-mono" style={{ color: "#a5b4fc" }}>
                solution.js
              </span>
              <span className="text-xs" style={{ color: "#6366f1" }}>
                JavaScript
              </span>
            </div>
            {/* Textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="code-editor-textarea w-full text-sm leading-relaxed p-4"
              style={{
                background: "#13111d",
                color: "#e2e8f0",
                minHeight: "320px",
                fontFamily: "var(--font-geist-mono), monospace",
              }}
              spellCheck={false}
              aria-label="Code editor"
            />
          </div>

          {phase === "coding" && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
              style={{
                background: submitting ? "var(--border)" : "var(--accent)",
                color: submitting ? "var(--text-muted)" : "#fff",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting
                ? <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Running code...
                  </>
                : "Submit Code"}
            </button>
          )}
        </div>
      </div>

      {/* Results panel */}
      {phase === "result" && (
        <div className="mt-6 flex flex-col gap-4">
          {/* Score banner */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{
              background: feedback.passed ? "#d1fae5" : "#fee2e2",
              border: feedback.passed
                ? "1px solid #10b981"
                : "1px solid #ef4444",
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-xl font-bold"
              style={{
                background: feedback.passed ? "#065f46" : "#991b1b",
                color: "#fff",
              }}
            >
              {feedback.score}
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: feedback.passed ? "#065f46" : "#991b1b" }}
              >
                {feedback.passed ? "✓ Tests Passed" : "✕ Tests Failed"} — Score:{" "}
                {feedback.score}/100
              </p>
              <p
                className="text-xs mt-0.5 leading-relaxed"
                style={{ color: feedback.passed ? "#047857" : "#dc2626" }}
              >
                {feedback.summary}
              </p>
            </div>
          </div>

          {/* AI Feedback */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              🤖 AI Code Review
            </p>
            <div className="flex flex-col gap-2.5">
              {feedback.issues.map((issue, i) => {
                const cfg = issueIcons[issue.type];
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: cfg.bg }}
                  >
                    <span
                      className="text-sm font-bold shrink-0"
                      style={{ color: cfg.color }}
                    >
                      {cfg.icon}
                    </span>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: cfg.color }}
                    >
                      {issue.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-purple)",
                color: "var(--accent)",
              }}
            >
              Retry Question
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Next Question →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
