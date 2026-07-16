"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { fetchChatCompletion } from "@/api/chat";

// Removed static mocks

export default function CourseTopicsPage({ params }) {
  const { code } = use(params);

  const [activeCourse, setActiveCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mobile Chat Visibility State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // AI Chat Tutor states
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am Rex, your AI Tutor. Click the **Explain** button next to any syllabus topic on the left to learn more, or type your question below!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const _dummy = [chatMessages, isAiThinking];
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiThinking]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/student/me/course/${code}`, {
          credentials: "omit"
        });
        if (res.ok) {
          const data = await res.json();
          setActiveCourse(data);
        } else if (res.status === 401) {
          // Retry with include for safety in case of auth need
          const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/student/me/course/${code}`, {
            credentials: "include"
          });
          if (res2.ok) {
            const data = await res2.json();
            setActiveCourse(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch course details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [code]);

  // Handler to toggle syllabus item completion status
  const handleToggleTopic = async (topicId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/student/me/topic/${topicId}/toggle`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        
        // Update local state without refetching the whole thing to feel snappy
        setActiveCourse((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            progress: data.new_progress,
            topics: prev.topics.map(t => 
              t.id === topicId ? { ...t, is_completed: data.is_completed } : t
            )
          };
        });
      }
    } catch (err) {
      console.error("Failed to toggle topic", err);
    }
  };

  const currentProgress = activeCourse?.progress || 0;

  if (loading) {
    return <div className="p-8 text-center text-sm font-medium text-zinc-500">Loading course...</div>;
  }
  
  if (!activeCourse) {
    return <div className="p-8 text-center text-sm font-medium text-red-500">Course not found.</div>;
  }

  // Trigger AI Tutor explanation of a specific topic
  const handleExplainTopic = async (topicName, index) => {
    const promptText = `Explain Topic ${index + 1}: ${topicName}`;

    setChatMessages((prev) => [...prev, { sender: "user", text: promptText }]);
    setIsAiThinking(true);

    // Automatically open the mobile drawer if the user clicks explain on mobile
    setIsChatOpen(true);

    try {
      const explanation = await fetchChatCompletion(promptText);
      setChatMessages((prev) => [...prev, { sender: "ai", text: explanation }]);
    } catch (error) {
      console.error("Explain topic error:", error);
      setChatMessages((prev) => [...prev, { sender: "ai", text: "Sorry, I encountered an error while trying to explain this topic." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Custom chat send handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userQuery = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { sender: "user", text: userQuery }]);
    setIsAiThinking(true);

    try {
      const replyText = await fetchChatCompletion(userQuery);
      
      setChatMessages((prev) => [...prev, { sender: "ai", text: replyText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [...prev, { sender: "ai", text: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Shared inner content function to keep things DRY
  const renderChatInnerContent = () => (
    <div className="flex-1 flex flex-col h-full min-h-0">
      {/* Chat Header */}
      <div className="shrink-0 pb-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex">
              <h2 className="mr-8 text-sm font-bold text-zinc-900 leading-tight">
                Rex
              </h2>
              <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping" />
                Online Helper
              </span>
            </div>
          </div>
        </div>

        {/* Mobile-only minus icon button */}
        <button
          onClick={() => setIsChatOpen(false)}
          className="lg:hidden p-1 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
          aria-label="Minimize Chat"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
          </svg>
        </button>
      </div>

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-3 text-xs">
        {chatMessages.map((msg, index) => (
          <div
            key={`${msg.sender}-${index}`}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${msg.sender === "user"
                  ? "bg-zinc-900 text-white rounded-tr-none"
                  : "bg-zinc-100 text-zinc-800 rounded-tl-none border border-zinc-200/50"
                }`}
            >
              {typeof msg.text === "string" && msg.text.includes("###") ? (
                <div className="space-y-2">
                  {msg.text.split("\n").map((line, i) => {
                    // Unique key generation using index
                    const uniqueKey = `line-${i}`;

                    if (line.startsWith("###")) {
                      return (
                        <h4
                          key={uniqueKey}
                          className="font-bold text-sm text-purple-700"
                        >
                          {line.replace("### ", "")}
                        </h4>
                      );
                    }
                    if (line.startsWith("####")) {
                      return (
                        <h5
                          key={uniqueKey}
                          className="font-bold text-xs text-zinc-900 mt-1"
                        >
                          {line.replace("#### ", "")}
                        </h5>
                      );
                    }
                    return (
                      <p
                        key={uniqueKey}
                        className={line === "" ? "h-2" : ""} // Preserves line breaks visually
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <p>{typeof msg.text === "string" ? msg.text : JSON.stringify(msg.text)}</p>
              )}
            </div>
          </div>
        ))}

        {isAiThinking && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 border border-zinc-200/50 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 w-fit">
              <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="mt-auto shrink-0 flex items-center gap-2 border border-zinc-200 bg-white p-1 rounded-xl shadow-xs focus-within:border-zinc-400"
      >
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask AI Tutor anything..."
          className="flex-1 px-3 py-2 text-xs bg-transparent border-none outline-none text-zinc-800"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white transition-colors hover:bg-zinc-800"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </form>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4 md:px-0 relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Syllabus Topics
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Study and prepare for each unit with your AI Tutor helper
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Column: Detailed Syllabus view */}
        <div className="lg:col-span-2">
          {/* Responsive classes applied here to hide container styles on mobile */}
          <div className="flex flex-col h-auto lg:h-[80vh] lg:p-5 lg:rounded-2xl lg:bg-[var(--bg-card)] lg:border lg:border-[var(--border)]">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col min-h-0">
                {/* Detail Header */}
                <div className="border-b border-zinc-100 pb-4 mb-4 shrink-0">
                  <Link
                    href="/study-plan"
                    className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-colors mb-3 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <title>Back arrow</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back to Electives
                  </Link>

                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-900 text-white border border-zinc-900">
                          {activeCourse.code}
                        </span>
                        <span className="text-xs font-semibold text-zinc-400">
                          {activeCourse.subject}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-zinc-900 mt-1">
                        {activeCourse.title}
                      </h2>
                    </div>

                    {/* Combined Progress */}
                    <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200/60 px-3.5 py-2 rounded-xl">
                      <div className="w-20 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                          style={{
                            width: `${currentProgress}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-zinc-700">
                        {currentProgress}% Completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Syllabus Checklist Container */}
                <div className="lg:flex-1 lg:overflow-y-auto pr-2 flex flex-col gap-2.5">
                  {activeCourse.topics?.map((topic, index) => {
                    const isCompleted = topic.is_completed;
                    return (
                      <div
                        key={topic.id}
                        className={`flex items-center justify-between gap-4 p-3 rounded-xl border transition-all ${isCompleted
                            ? "bg-zinc-50/50 border-zinc-200/50"
                            : "bg-[#f9f9f9] border-zinc-200/80 hover:border-zinc-300"
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleTopic(topic.id)}
                          className="flex items-start gap-3 text-left flex-1 min-w-0 cursor-pointer"
                        >
                          {/* Checkbox Icon */}
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all mt-0.5 ${isCompleted
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "border-zinc-300 bg-white"
                              }`}
                          >
                            {isCompleted && (
                              <svg
                                className="w-3.5 h-3.5 stroke-current"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                              >
                                <title>Check icon</title>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-zinc-400 mr-1.5">
                              Topic {index + 1}.
                            </span>
                            <span
                              className={`text-sm font-semibold leading-snug break-words ${isCompleted
                                  ? "line-through text-zinc-400"
                                  : "text-zinc-800"
                                }`}
                            >
                              {topic.name}
                            </span>
                          </div>
                        </button>

                        {/* Explain Button */}
                        <button
                          type="button"
                          onClick={() => handleExplainTopic(topic.name, index)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100 hover:border-purple-300 transition-all shrink-0 cursor-pointer"
                        >
                          <svg
                            className="w-3.5 h-3.5 text-purple-600 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <title>Sparkle icon</title>
                            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
                          </svg>
                          Explain
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Desktop view Side Panel Chatbox */}
        <div className="hidden lg:flex lg:col-span-1">
          <div
            className="rounded-2xl p-5 sticky top-[5vh] h-[80vh] flex flex-col shadow-lg border border-zinc-200 w-full"
            style={{
              background: "var(--bg-card)",
            }}
          >
            {renderChatInnerContent()}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile Screens */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-95 z-50 cursor-pointer border border-zinc-700"
          aria-label="Open Chat Help"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
          </svg>
        </button>
      )}

      {/* Mobile Floating Overlay Chatbox System */}
      {isChatOpen && (
        <div className="lg:hidden fixed inset-x-4 bottom-6 top-20 bg-white rounded-2xl p-4 shadow-2xl flex flex-col border border-zinc-300 z-50 animate-in slide-in-from-bottom duration-200">
          {renderChatInnerContent()}
        </div>
      )}
    </div>
  );
}