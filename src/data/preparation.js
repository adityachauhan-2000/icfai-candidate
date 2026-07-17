"use client";
import { useEffect, useState } from "react";

export const TABS = [
  {
    id: "aptitude",
    label: "Aptitude",
    icon: "🧮",
    color: "#0f766e",
    desc: "Quant, logical, verbal — timed MCQ practice",
    href: "/preparation/aptitude",
  },
  {
    id: "gd",
    label: "Topic Preparation",
    icon: "🗣️",
    color: "#1d4ed8",
    desc: "AI-moderated topic discussion simulator",
    href: "/preparation/gd",
  },
  {
    id: "technical",
    label: "Technical",
    icon: "📊",
    color: "#7c3aed",
    desc: "Domain-specific MBA interview questions",
    href: "/preparation/technical",
  },
  {
    id: "hr",
    label: "HR Round",
    icon: "👔",
    color: "#b45309",
    desc: "Mock HR interview with AI feedback",
    href: "/preparation/hr",
  },
];

export const APTITUDE_QS = [
  {
    q: "A train travels 360 km in 4 hours. What is its speed in m/s?",
    options: ["20 m/s", "25 m/s", "30 m/s", "15 m/s"],
    answer: 1,
    shortcut: "360÷4 = 90 km/h. Divide by 3.6 → 25 m/s",
    category: "Quantitative",
  },
  {
    q: "If all Bloops are Razzles and all Razzles are Lazzles, which must be true?",
    options: [
      "All Lazzles are Bloops",
      "All Bloops are Lazzles",
      "No Bloops are Lazzles",
      "Some Razzles are not Lazzles",
    ],
    answer: 1,
    shortcut: "Chain syllogism: Bloops→Razzles→Lazzles. Option B follows.",
    category: "Logical Reasoning",
  },
  {
    q: "Choose the word most opposite to CANDID:",
    options: ["Honest", "Evasive", "Frank", "Transparent"],
    answer: 1,
    shortcut: "CANDID = open/honest. Antonym = EVASIVE (deliberately vague).",
    category: "Verbal",
  },
  {
    q: "Find the next number: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "36"],
    answer: 1,
    shortcut: "Pattern: n(n+1). Next is 6×7 = 42.",
    category: "Pattern Recognition",
  },
  {
    q: "A shopkeeper marks up goods by 25% and gives 10% discount. Net profit %?",
    options: ["12.5%", "15%", "10%", "17.5%"],
    answer: 0,
    shortcut: "1.25 × 0.90 = 1.125 → net profit 12.5%",
    category: "Quantitative",
  },
  {
    q: "Complete the analogy: Doctor : Hospital :: Teacher : ?",
    options: ["Book", "School", "Student", "Knowledge"],
    answer: 1,
    shortcut: "Place of work. Teacher → School.",
    category: "Logical Reasoning",
  },
  {
    q: "If a clock shows 3:15, what is the angle between hour and minute hands?",
    options: ["0°", "7.5°", "15°", "30°"],
    answer: 1,
    shortcut:
      "Hour hand moves 0.5°/min. At 3:15, hour is at 3.25×30 = 97.5°. Minute at 90°. Diff = 7.5°.",
    category: "Quantitative",
  },
  {
    q: "Statement: All cats are mammals. Some pets are cats. Conclusion?",
    options: [
      "All mammals are pets",
      "Some mammals are pets",
      "No cats are pets",
      "All pets are cats",
    ],
    answer: 1,
    shortcut:
      "Some pets are cats → those cats are mammals → some mammals are pets.",
    category: "Logical Reasoning",
  },
  {
    q: "Select the synonym of PERSEVERANCE:",
    options: ["Hesitation", "Persistence", "Surrender", "Restlessness"],
    answer: 1,
    shortcut: "PERSEVERANCE = continued effort. Synonym = PERSISTENCE.",
    category: "Verbal",
  },
  {
    q: "What comes next: 1, 1, 2, 3, 5, 8, ?",
    options: ["10", "12", "13", "15"],
    answer: 2,
    shortcut: "Fibonacci sequence. 5+8 = 13.",
    category: "Pattern Recognition",
  },
];

export const TECH_DOMAINS = [
  "Finance",
  "Marketing",
  "Operations",
  "HR Management",
];
export const TECH_QS = {
  Finance: [
    {
      q: "What is the difference between NPV and IRR?",
      tip: "NPV = absolute value created. IRR = discount rate where NPV = 0. Use NPV for mutually exclusive projects.",
    },
    {
      q: "Explain the Capital Asset Pricing Model (CAPM).",
      tip: "Expected Return = Rf + β(Rm − Rf). β measures systematic risk.",
    },
    {
      q: "What is working capital management?",
      tip: "WC = Current Assets − Current Liabilities. Manages the liquidity cycle.",
    },
    {
      q: "Difference between equity and debt financing?",
      tip: "Equity: dilution, no fixed obligation. Debt: tax shield, interest obligation.",
    },
  ],
  Marketing: [
    {
      q: "Difference between STP and 4P frameworks?",
      tip: "STP = who to target. 4P = how to reach them.",
    },
    {
      q: "How would you measure a brand campaign's success?",
      tip: "Brand awareness, sentiment, NPS, recall studies, engagement.",
    },
    {
      q: "What is customer lifetime value (CLV)?",
      tip: "CLV = Avg Purchase Value × Frequency × Lifespan.",
    },
    {
      q: "Explain Porter's Five Forces with an FMCG example.",
      tip: "Apply: rivalry (HUL vs P&G), buyer power (retailers), supplier power, entrants, substitutes.",
    },
  ],
  Operations: [
    {
      q: "Difference between lean and six sigma?",
      tip: "Lean = eliminate waste. Six Sigma = reduce variation. Both improve process efficiency.",
    },
    {
      q: "Explain the bullwhip effect in supply chains.",
      tip: "Small retail demand changes amplify into large upstream swings due to forecast errors.",
    },
    {
      q: "What is the EOQ model?",
      tip: "EOQ = √(2DS/H). Minimises total ordering + holding cost.",
    },
    {
      q: "How does JIT differ from traditional inventory management?",
      tip: "JIT keeps stock near-zero. Lower holding cost, higher stockout risk.",
    },
  ],
  "HR Management": [
    {
      q: "Difference between job enlargement and job enrichment?",
      tip: "Enlargement = more tasks same level (horizontal). Enrichment = more responsibility (vertical).",
    },
    {
      q: "Explain Maslow's hierarchy and employee motivation.",
      tip: "Physiological→Safety→Social→Esteem→Self-actualisation. Unmet needs drive behaviour.",
    },
    {
      q: "What is a 360-degree appraisal?",
      tip: "Feedback from manager, peers, subordinates, self. Reduces top-down bias.",
    },
    {
      q: "How would you handle a high-performer who is culturally toxic?",
      tip: "Address behaviour directly. Culture > short-term output. Use PIPs or exit if needed.",
    },
  ],
};

export const HR_QS = [
  {
    q: "Tell me about yourself.",
    tip: "Present → Past → Future. Under 2 minutes. Tie it to why this company.",
    method: "Structured Intro",
  },
  {
    q: "Why should we hire you over other candidates?",
    tip: "3 pillars: unique skill, specific achievement, how it solves the company's need.",
    method: "Value Pitch",
  },
  {
    q: "Tell me about a time you failed and what you learnt.",
    tip: "STAR: honest about failure, focus 70% on learnings.",
    method: "STAR",
  },
  {
    q: "Where do you see yourself in 5 years?",
    tip: "Specific role/industry. Ambition + realism. Connect to company growth.",
    method: "Career Vision",
  },
  {
    q: "Describe a time you led a team through conflict.",
    tip: "STAR: listen first, find root cause, mediate, preserve relationships.",
    method: "STAR",
  },
  {
    q: "What is your biggest strength?",
    tip: "One strength with a specific story. Quantify impact.",
    method: "Value Pitch",
  },
];

export const GD_PANELISTS = [
  { name: "Kavya", avatar: "K", color: "#7c3aed" },
  { name: "Rohan", avatar: "R", color: "#0f766e" },
  { name: "Priya", avatar: "P", color: "#1d4ed8" },
];

export const GD_SCENARIOS = [
  {
    topic: "Work from home is more productive than working from office.",
    type: "Debate",
    forPoints: [
      "Saves 90 min commute daily",
      "Deep focus improves at home",
      "Access to global talent",
    ],
    againstPoints: [
      "Complex collaboration suffers",
      "Junior employees miss mentoring",
      "Work-life boundary blurs",
    ],
    facts: [
      "Stanford: 13% WFH productivity gain",
      "Microsoft: 54% feel overworked remotely",
      "Real estate cost drops 30% with remote",
    ],
  },
  {
    topic: "CSR should be mandatory for all companies, not just large ones.",
    type: "Policy",
    forPoints: [
      "Builds community trust",
      "Tax incentives make it viable",
      "Long-term brand equity",
    ],
    againstPoints: [
      "Financial burden on SMEs",
      "No implementation infrastructure",
      "Better to incentivise than mandate",
    ],
    facts: [
      "India: CSR mandatory for ₹5Cr+ profit firms",
      "Only 2% SMEs do CSR voluntarily",
      "UN SDG 17 demands private sector partnership",
    ],
  },
  {
    topic: "AI will replace middle management in the next decade.",
    type: "Trending",
    forPoints: [
      "Faster unbiased data processing",
      "40%+ cost reduction potential",
      "Removes approval bottlenecks",
    ],
    againstPoints: [
      "Empathy and negotiation can't be coded",
      "Accountability needs a human",
      "Change management is irreplaceable",
    ],
    facts: [
      "McKinsey: 60% of management tasks automatable",
      "WEF: 97M new jobs created by 2025",
      "IBM uses AI for supply chain and HR hiring",
    ],
  },
  {
    topic: "Should India adopt a 4-day work week?",
    type: "Policy",
    forPoints: [
      "Better work-life balance",
      "Higher productivity per hour",
      "Reduced carbon footprint",
    ],
    againstPoints: [
      "Hurts competitiveness",
      "Not feasible for all sectors",
      "MNC alignment issues",
    ],
    facts: [
      "Iceland trial: productivity same or better",
      "UK: 61 companies piloting 4-day week",
      "IT sector in India leads remote adoption",
    ],
  },
  {
    topic: "Is an MBA degree still relevant in 2025?",
    type: "Debate",
    forPoints: [
      "Builds business fundamentals",
      "Networking opportunities",
      "Higher lifetime earnings",
    ],
    againstPoints: [
      "Experience > classroom learning",
      "Skyrocketing tuition costs",
      "Online courses offer cheaper alternatives",
    ],
    facts: [
      "Avg ROI: 3–5 years for top B-schools",
      "IIM A avg package: ₹34L in 2024",
      "LinkedIn: 80% skills learnt on job",
    ],
  },
];

export const GD_ANALYSIS_DATA = {
  "Work from home is more productive than working from office.": {
    strengths:
      "You clearly articulated the productivity benefits of remote work, especially around commute savings and deep focus. Your opening argument was well-structured and you engaged with counter-points effectively.",
    improvements:
      "To strengthen further, incorporate more data-driven arguments (e.g., Stanford study showing 13% productivity gain). Work on addressing the collaboration concern more directly — acknowledge the challenge before rebutting it.",
    strategy:
      "Your discussion strategy shows good balance. You state a position, listen to opposing views, and adapt. For future GDs, try to initiate the discussion or volunteer for the summary role — these stand out to evaluators.",
  },
  "CSR should be mandatory for all companies, not just large ones.": {
    strengths:
      "You showed awareness of the social impact angle and made a strong ethical case for mandatory CSR. Your points about community trust and long-term brand equity demonstrate strategic thinking.",
    improvements:
      "The financial burden on SMEs is a strong counter-argument that needs more attention. Research specific tax incentive models that make CSR viable for smaller firms. Also consider the implementation infrastructure gap.",
    strategy:
      "You tend to argue from principles — which is good — but pairing ideals with practical examples makes your point more convincing. Reference specific CSR success stories (e.g., Tata's community initiatives) to ground your argument.",
  },
  "AI will replace middle management in the next decade.": {
    strengths:
      "You demonstrated good awareness of AI capabilities and their impact on operational roles. Your points about cost reduction and unbiased data processing showed understanding of the technology landscape.",
    improvements:
      "The human elements of management — empathy, negotiation, accountability — need stronger emphasis. Middle management isn't just about data processing; it's about people development and conflict resolution.",
    strategy:
      "This is a polarizing topic. The best approach is to find middle ground: AI will transform middle management rather than replace it. Position yourself as someone who understands both technology and human dynamics.",
  },
  "Should India adopt a 4-day work week?": {
    strengths:
      "You effectively connected the 4-day work week conversation to India's unique work culture. Your points about work-life balance and productivity per hour showed thoughtful consideration.",
    improvements:
      "The competitiveness argument needs deeper exploration. India competes globally, and a 4-day week could impact client servicing in IT and BPO sectors. Address sector-specific feasibility.",
    strategy:
      "For policy debates like this, always lead with international evidence (Iceland, UK trials) before discussing India-specific challenges. This shows you can think globally and act locally — a key MBA trait.",
  },
  "Is an MBA degree still relevant in 2025?": {
    strengths:
      "You made a compelling case for the MBA's value in building business fundamentals and networking. Connecting to placement statistics (IIM average packages) showed you've done your research.",
    improvements:
      "The rising cost of MBA programs is a real concern. Acknowledge the ROI question more directly and discuss how top B-schools are adapting their curriculum to stay relevant.",
    strategy:
      "When discussing your own education, strike a confident but balanced tone. Acknowledge alternative learning paths while demonstrating why you chose the MBA route. This shows self-awareness and conviction.",
  },
};

export const AI_TIPS = {
  aptitude: [
    "Learn 2–3 shortcuts per topic — brute force fails under time pressure",
    "Practice 20 min daily under timed conditions",
    "After each mock, find your weakest category and drill it",
  ],
  gd: [
    "Initiate or summarise — don't be in the middle",
    "Build on others' points, don't just contradict",
    "Read one business article every morning for ready-made examples",
  ],
  technical: [
    "Know your SIP inside out — expect 3–5 questions on it",
    "For every concept, have a real Indian company example ready",
    "Practise 'why' chains: explain the logic behind every formula",
  ],
  hr: [
    "Prepare 5–6 STAR stories adaptable to any question",
    "For 'Why us?', cite specific things: values, products, recent news",
    "Practise out loud — fluency comes from verbal rehearsal only",
  ],
};

export function useAIGenerate(trigger) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, [trigger]);
  return ready;
}

export function Loader({ color, text }) {
  const [d, setD] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setD((x) => (x + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              background: color,
              opacity: d > i ? 1 : 0.2,
              transform: d > i ? "scale(1.2)" : "scale(1)",
            }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {text || "AI is generating"}
        {".".repeat(d)}
      </p>
    </div>
  );
}

export function CircularScore({ score, size = 80, color }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="absolute text-lg font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

export function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
