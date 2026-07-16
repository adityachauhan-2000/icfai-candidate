"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const testimonialVideos = [
  {
    id: "KgViamGlhYI",
    url: "https://youtu.be/KgViamGlhYI",
    title: "Dr  Arijit Bhattacharya - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/KgViamGlhYI/hqdefault.jpg",
  },
  {
    id: "nC8KEjvJ6Oc",
    url: "https://www.youtube.com/watch?v=nC8KEjvJ6Oc",
    title: "Dr  Dimple Pandey - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/nC8KEjvJ6Oc/hqdefault.jpg",
  },
  {
    id: "T3W-1XHz5D4",
    url: "https://www.youtube.com/watch?v=T3W-1XHz5D4",
    title: "Dr  Swaha Shome - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/T3W-1XHz5D4/hqdefault.jpg",
  },
  {
    id: "qQcFEgQlSPY",
    url: "https://youtu.be/qQcFEgQlSPY",
    title: "Dr  Roopali Srivastava - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/qQcFEgQlSPY/hqdefault.jpg",
  },
  {
    id: "d5KoY78mNPk",
    url: "https://youtu.be/d5KoY78mNPk",
    title: "Dr Priyanka Dhingra - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/d5KoY78mNPk/hqdefault.jpg",
  },
  {
    id: "nQ6B0QkUv-4",
    url: "https://youtu.be/nQ6B0QkUv-4",
    title: "Prof  Chitvan Mehrotra - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/nQ6B0QkUv-4/hqdefault.jpg",
  },
  {
    id: "_iaFe3heD_E",
    url: "https://youtu.be/_iaFe3heD_E",
    title: "Prof  Kedar Dunakhe - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/_iaFe3heD_E/hqdefault.jpg",
  },
  {
    id: "CqsBy_pK93g",
    url: "https://youtu.be/CqsBy_pK93g",
    title: "Prof  Nitin Bolinjkar - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/CqsBy_pK93g/hqdefault.jpg",
  },
  {
    id: "-0xzom5XZSo",
    url: "https://youtu.be/-0xzom5XZSo",
    title: "Prof  Punit Neb - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/-0xzom5XZSo/hqdefault.jpg",
  },
  {
    id: "CGHRjGyiEBU",
    url: "https://www.youtube.com/watch?v=CGHRjGyiEBU",
    title: "Prof  Shobha Pillai - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/CGHRjGyiEBU/hqdefault.jpg",
  },
  {
    id: "qMednEHhuNc",
    url: "https://youtu.be/qMednEHhuNc",
    title: "Dr  Vidhu K Mathur, Marketing - IBS Jaipur",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/qMednEHhuNc/hqdefault.jpg",
  },
  {
    id: "D1hBDUg73VA",
    url: "https://youtu.be/D1hBDUg73VA",
    title: "Dr  Kapil Agrawal,Marketing - IBS Jaipur",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/D1hBDUg73VA/hqdefault.jpg",
  },
  {
    id: "9LenJCElUng",
    url: "https://youtu.be/9LenJCElUng",
    title: "Dr  Shweta Jain, HR - IBS Jaipur",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/9LenJCElUng/hqdefault.jpg",
  },
  {
    id: "jefRClwkcgc",
    url: "https://youtu.be/jefRClwkcgc",
    title: "Dr  Sumedha Soni, HR - IBS Jaipur",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/jefRClwkcgc/hqdefault.jpg",
  },
  {
    id: "QCmFbRObCQ0",
    url: "https://youtu.be/QCmFbRObCQ0",
    title: "C A Sukriti Khatri, Finance - IBS Jaipur",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/QCmFbRObCQ0/hqdefault.jpg",
  },
  {
    id: "fCIIWjWGz0A",
    url: "https://youtu.be/fCIIWjWGz0A",
    title: "Dr  Archana Rathore, IT & Operations- IBS Jaipur",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/fCIIWjWGz0A/hqdefault.jpg",
  },
  {
    id: "SLhG895zGF0",
    url: "https://youtu.be/SLhG895zGF0",
    title: "Dr  Amita Chourasiya, IT & Operations - IBS Jaipur",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/SLhG895zGF0/hqdefault.jpg",
  },
  {
    id: "ZwNdarA4O0c",
    url: "https://youtu.be/ZwNdarA4O0c",
    title: "Dr  Vinay Khandewal, Finance - IBS Jaipur",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/ZwNdarA4O0c/hqdefault.jpg",
  },
  {
    id: "3I6OxjZ2F7M",
    url: "https://www.youtube.com/watch?v=3I6OxjZ2F7M",
    title: "Dr. Mohammad Shariq, Marketing - IBS Gurgaon",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/3I6OxjZ2F7M/hqdefault.jpg",
  },
  {
    id: "FTRfzXIUOJY",
    url: "https://www.youtube.com/watch?v=FTRfzXIUOJY",
    title: "Prof.Shweta Agrawal, IT - IBS Gurgaon",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/FTRfzXIUOJY/hqdefault.jpg",
  },
  {
    id: "1bQNigMLHbY",
    url: "https://www.youtube.com/watch?v=1bQNigMLHbY",
    title: "Prof.Sanjeev Sareen, Operations - IBS Gurgaon",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/1bQNigMLHbY/hqdefault.jpg",
  },
  {
    id: "7NCJsXVE7YM",
    url: "https://www.youtube.com/watch?v=7NCJsXVE7YM",
    title: "Prof. Vineeta Jha, Marketing - IBS Gurgaon",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/7NCJsXVE7YM/hqdefault.jpg",
  },
  {
    id: "F4yB6yy24Rs",
    url: "https://www.youtube.com/watch?v=F4yB6yy24Rs",
    title: "Prof Rajesh Mishra, Finance - IBS Gurgaon",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/F4yB6yy24Rs/hqdefault.jpg",
  },
  {
    id: "xw_XViF9hXQ",
    url: "https://www.youtube.com/watch?v=xw_XViF9hXQ",
    title: "Dr.Bhavna Chhabra, Finance - IBS Gurgaon",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/xw_XViF9hXQ/hqdefault.jpg",
  },
  {
    id: "CHcV_dgjYC0",
    url: "https://www.youtube.com/watch?v=CHcV_dgjYC0",
    title: "Prof  Shweta Sharma, IT - IBS Gurgaon",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/CHcV_dgjYC0/hqdefault.jpg",
  },
  {
    id: "rFdy2UBVljo",
    url: "https://www.youtube.com/watch?v=rFdy2UBVljo",
    title: "Dr. Mona Sahay, HR - IBS Gurgaon",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/rFdy2UBVljo/hqdefault.jpg",
  },
  {
    id: "i5T7VnsuyRQ",
    url: "https://www.youtube.com/watch?v=i5T7VnsuyRQ",
    title: "Prof. Mohammad Shariq, Marketing - IBS Gurgaon",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/i5T7VnsuyRQ/hqdefault.jpg",
  },
  {
    id: "NjAwrD_yxs8",
    url: "https://www.youtube.com/watch?v=NjAwrD_yxs8",
    title: "Dr. Davinder Suri - IBS Mumbai",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/NjAwrD_yxs8/hqdefault.jpg",
  },
  {
    id: "X1aOUP5SINQ",
    url: "https://youtu.be/X1aOUP5SINQ",
    title: "Dr  Girish Kulkarni, Marketing - IBS Pune",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/X1aOUP5SINQ/hqdefault.jpg",
  },
  {
    id: "mAmtQOZ8G4A",
    url: "https://youtu.be/mAmtQOZ8G4A",
    title: "Dr  Irfan Inamdar, Marketing - IBS Pune",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/mAmtQOZ8G4A/hqdefault.jpg",
  },
  {
    id: "9EoGleF7r0Q",
    url: "https://youtu.be/9EoGleF7r0Q",
    title: "Prof  Sudhir Dravid, Finance - IBS Pune",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/9EoGleF7r0Q/hqdefault.jpg",
  },
  {
    id: "_gsJM92QudM",
    url: "https://youtu.be/_gsJM92QudM",
    title: "Dr  Saumya Misra, Finance - IBS Pune",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/_gsJM92QudM/hqdefault.jpg",
  },
  {
    id: "07uk4Br9OTs",
    url: "https://youtu.be/07uk4Br9OTs",
    title: "Dr  Jaysingh Bhosale, IT & Operations, IBS Pune",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/07uk4Br9OTs/hqdefault.jpg",
  },
  {
    id: "-yDz2296ONg",
    url: "https://youtu.be/-yDz2296ONg",
    title: "Prof  Moushmi Dasgupta, IT & Operations - IBS Pune",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/-yDz2296ONg/hqdefault.jpg",
  },
  {
    id: "yUWHTQplKfM",
    url: "https://youtu.be/yUWHTQplKfM",
    title: "Dr  Pallvi Vadehra, HR - IBS Pune",
    author: "ICFAI Business School",
    thumbnail: "https://i.ytimg.com/vi/yUWHTQplKfM/hqdefault.jpg",
  },
];

// Helper to parse Name and Title/Department from video title
const parseVideoTitle = (title) => {
  // Clean up double spaces
  const cleanTitle = title.replace(/\s+/g, " ");
  const parts = cleanTitle.split(/ - | – /);

  let name = parts[0] || "IBS Faculty";
  let subtitle = parts[1] || "ICFAI Business School";

  // Format Name (clean CA/Dr spaces)
  name = name.replace(/^Dr\s+/, "Dr. ").replace(/^C A\s+/, "CA. ");

  // Format Subtitle
  subtitle = subtitle.replace(", ", " • ");

  return { name, subtitle };
};

export default function CaseStudiesPage() {
  const [activeVideo, setActiveVideo] = useState(null);

  const parsedVideos = useMemo(() => {
    return testimonialVideos.map((video) => ({
      ...video,
      ...parseVideoTitle(video.title),
    }));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Case Studies & Testimonials
        </h1>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Watch how IBS students transformed into corporate leaders through
          case-based learning.
        </p>
      </div>

      {/* Videos Widescreen Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parsedVideos.map((video) => (
          <button
            key={video.id}
            type="button"
            aria-label={`Watch testimonial of ${video.name}`}
            onClick={() => setActiveVideo(video)}
            className="group relative aspect-video rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 border-none bg-zinc-950 w-full"
          >
            {/* Thumbnail Image Cover */}
            <Image
              src={video.thumbnail}
              alt={video.name}
              width={480}
              height={270}
              unoptimized
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-6" />

            {/* Content Details */}
            <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between z-10 w-full">
              <div className="text-left pr-4">
                <h3 className="font-bold text-lg text-white leading-snug tracking-tight">
                  {video.name}
                </h3>
                <p className="text-xs text-white/75 mt-1 font-medium">
                  {video.subtitle}
                </p>
              </div>

              {/* Play Button Icon */}
              <div className="w-11 h-11 rounded-full border border-white/35 group-hover:border-white bg-black/15 group-hover:bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 transition-all duration-200">
                <svg
                  className="w-4 h-4 text-white fill-current translate-x-0.5"
                  viewBox="0 0 24 24"
                >
                  <title>Play Video</title>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Video Iframe Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 bg-black/60 backdrop-blur-xs border-none w-full h-full cursor-default"
            onClick={() => setActiveVideo(null)}
            aria-label="Close modal backdrop"
          />

          {/* Modal Box */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col z-10 animate-fade-in border border-zinc-200">
            {/* Title / Close Bar */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-100 shrink-0">
              <div>
                <h2 className="font-bold text-sm text-zinc-900 leading-tight">
                  {activeVideo.name}
                </h2>
                <p className="text-xs text-zinc-500">{activeVideo.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-zinc-700 cursor-pointer"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <title>Close Modal</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Video Iframe Wrapper */}
            <div className="flex-1 min-h-0 relative aspect-video bg-black w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-zinc-50 flex justify-between items-center shrink-0">
              <span className="text-xs font-semibold text-zinc-500">
                Source: {activeVideo.author}
              </span>
              <a
                href={activeVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 shadow-xs"
              >
                Open on YouTube
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <title>Open link</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
