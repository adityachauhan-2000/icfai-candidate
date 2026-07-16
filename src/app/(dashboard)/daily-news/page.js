"use client";

import { useState, useEffect } from "react";

const CATEGORIES = ["Finance", "Technology", "Startups", "Markets", "Economy"];

export default function DailyNewPage() {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0]);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-7saqfpox9-adityas-projects-4b60fae5.vercel.app"}/api/news?category=${activeTab}`);
        if (res.ok) {
          const data = await res.json();
          setNewsList(data);
        }
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [activeTab]);

  const filteredNews = newsList;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
        Daily News
      </h1>

      {/* Tabs */}
      <div
        className="flex gap-2 overflow-x-auto pb-4 mb-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {CATEGORIES.map((category) => {
          const isActive = activeTab === category;
          return (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
              style={{
                background: isActive ? "var(--accent)" : "transparent",
                color: isActive ? "#ffffff" : "var(--text-secondary)",
                border: isActive ? "1px solid var(--accent)" : "1px solid var(--border)",
              }}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center items-center">
            <div className="animate-spin w-8 h-8 border-4 rounded-full border-t-transparent" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
          </div>
        ) : filteredNews.length > 0 ? (
          filteredNews.map((news) => (
            <div
              key={news.id}
              className="flex flex-col sm:flex-row rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 h-auto sm:h-48"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Image */}
              <div className="h-48 sm:h-full w-full sm:w-56 shrink-0 overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1 justify-center">
                <span
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--accent)" }}
                >
                  {news.category}
                </span>
                <h3
                  className="text-lg font-semibold mb-2 line-clamp-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {news.title}
                </h3>
                <p
                  className="text-sm line-clamp-2 mb-4 flex-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {news.desc}
                </p>

                <a
                  href={news.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-left transition-colors mt-auto"
                  style={{ color: "var(--accent)" }}
                >
                  Read more →
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p style={{ color: "var(--text-muted)" }}>No news available in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

