"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import SciSeekLogo from "./components/sciseek-logo";

type AnswerSection = {
  title: string;
  body: string;
};

type Citation = {
  title: string;
  url: string;
  source: string;
};

type AskResponse = {
  is_science: boolean;
  refusal_message?: string | null;
  hook?: string | null;
  short_summary?: string | null;
  sections?: AnswerSection[] | null;
  key_points?: string[] | null;
  related_questions: string[];
  citations?: Citation[] | null;
};

type HistoryItem = {
  id: string;
  question: string;
  answer: string;
  answerData?: AskResponse | null;
  createdAt: string;
};

const starterHistory: HistoryItem[] = [
  {
    id: "1",
    question: "What is dark matter?",
    answer:
      "Dark matter is a form of matter that does not emit light but exerts gravitational effects on galaxies.",
    createdAt: "2026-04-07T09:00:00.000Z",
    answerData: {
      is_science: true,
      hook: "Dark matter may make up most of the matter in the universe.",
      short_summary:
        "Scientists infer dark matter from its gravitational effects on galaxies and galaxy clusters, even though it does not emit, absorb, or reflect light in a detectable way.",
      sections: [
        {
          title: "Why scientists think it exists",
          body:
            "Galaxies rotate too quickly for their visible matter alone to hold them together. Additional unseen mass appears to provide the needed gravity.",
        },
        {
          title: "Why it is still mysterious",
          body:
            "Dark matter has not been directly detected, so scientists still do not know what particle or substance it is made of.",
        },
      ],
      key_points: [
        "It does not interact with light the way normal matter does.",
        "Its presence is inferred from gravity.",
        "It is one of the biggest open questions in modern physics.",
      ],
      related_questions: [
        "What is the difference between dark matter and dark energy?",
        "How do scientists detect invisible matter?",
      ],
      citations: [],
    },
  },
  {
    id: "2",
    question: "Why do black holes evaporate?",
    answer:
      "Black holes lose mass due to Hawking radiation caused by quantum effects near the event horizon.",
    createdAt: "2026-04-06T16:30:00.000Z",
    answerData: {
      is_science: true,
      hook: "Black holes are not completely black forever.",
      short_summary:
        "Quantum effects near the event horizon can cause black holes to emit energy, which slowly reduces their mass over time.",
      sections: [
        {
          title: "What Hawking radiation is",
          body:
            "In simplified terms, quantum fluctuations near the event horizon can lead to energy escaping, making the black hole lose mass.",
        },
        {
          title: "What happens over time",
          body:
            "For very large black holes this process is incredibly slow, but over enormous timescales it can cause them to shrink and eventually disappear.",
        },
      ],
      key_points: [
        "Hawking radiation comes from quantum effects.",
        "Black holes can lose energy and mass.",
        "The process is extremely slow for astrophysical black holes.",
      ],
      related_questions: [
        "What happens when a black hole fully evaporates?",
        "How was Hawking radiation discovered?",
      ],
      citations: [],
    },
  },
  {
    id: "3",
    question: "Could humans survive on Europa?",
    answer:
      "Europa is extremely cold with high radiation, so survival would require advanced habitats.",
    createdAt: "2026-04-05T19:10:00.000Z",
    answerData: {
      is_science: true,
      hook: "Europa is fascinating, but it is brutally hostile to human life.",
      short_summary:
        "Humans could not survive on Europa without heavy technological support because of intense radiation, freezing temperatures, and lack of a breathable atmosphere.",
      sections: [
        {
          title: "Main dangers",
          body:
            "Europa experiences extreme cold, almost no usable atmosphere, and intense radiation from Jupiter's magnetosphere.",
        },
        {
          title: "What survival would require",
          body:
            "Any human presence would need shielded habitats, life support, energy systems, and likely subsurface protection from radiation.",
        },
      ],
      key_points: [
        "Europa is not naturally habitable for humans.",
        "Radiation is one of the biggest threats.",
        "A base would require major engineering support.",
      ],
      related_questions: [
        "Why is Europa considered important for life?",
        "How much radiation reaches Europa's surface?",
      ],
      citations: [],
    },
  },
  {
    id: "4",
    question: "How likely is alien life?",
    answer:
      "Statistically plausible given the size of the universe, but currently unconfirmed.",
    createdAt: "2026-04-03T13:45:00.000Z",
    answerData: {
      is_science: true,
      hook:
        "The universe is so vast that alien life seems plausible, but we still do not have direct proof.",
      short_summary:
        "Many scientists think life elsewhere is statistically likely because there are so many stars and planets, but no confirmed extraterrestrial life has been found so far.",
      sections: [
        {
          title: "Why scientists think it may exist",
          body:
            "There are hundreds of billions of galaxies and enormous numbers of planets, including many in habitable zones.",
        },
        {
          title: "Why it remains unconfirmed",
          body:
            "We still lack direct, verified evidence of life beyond Earth, whether simple microbes or intelligent civilizations.",
        },
      ],
      key_points: [
        "Large numbers make alien life plausible.",
        "Plausible is not the same as proven.",
        "Evidence is still the key missing piece.",
      ],
      related_questions: [
        "What is the Drake Equation?",
        "Have any exoplanets shown signs of life?",
      ],
      citations: [],
    },
  },
];

const DISPLAY_LIMIT = 15;

<SciSeekLogo />

function SkeletonLine({
  width = "w-full",
  height = "h-4",
}: {
  width?: string;
  height?: string;
}) {
  return <div className={`animate-pulse rounded-md bg-white/10 ${height} ${width}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6">
        <SkeletonLine width="w-2/3" height="h-8" />
        <div className="mt-4 space-y-3">
          <SkeletonLine width="w-full" />
          <SkeletonLine width="w-11/12" />
          <SkeletonLine width="w-3/4" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6">
          <SkeletonLine width="w-1/3" height="h-6" />
          <div className="mt-4 space-y-3">
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-10/12" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6">
          <SkeletonLine width="w-1/4" height="h-6" />
          <div className="mt-4 space-y-3">
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-11/12" />
            <SkeletonLine width="w-4/5" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6">
        <SkeletonLine width="w-32" height="h-6" />
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-blue-400/70" />
            <SkeletonLine width="w-5/6" />
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-blue-400/70" />
            <SkeletonLine width="w-4/5" />
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-blue-400/70" />
            <SkeletonLine width="w-3/4" />
          </div>
        </div>
      </section>
    </div>
  );
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getSourceInitial(source: string, url: string) {
  const label = source?.trim() || getHostname(url);
  return label.charAt(0).toUpperCase();
}

function EmptyState({ onAsk }: { onAsk: (q: string) => void }) {
  const examples = [
    "What would happen if Earth stopped spinning?",
    "Why can’t we travel faster than light?",
    "How does the brain store memories?",
    "What is the Fermi Paradox?",
  ];

  return (
    <div className="mx-auto mt-10 max-w-2xl text-center sm:mt-14">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_24px_rgba(59,130,246,0.12)] sm:mb-5 sm:h-14 sm:w-14">
        <SciSeekLogo className="h-40 w-40 border-0 bg-transparent" />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
        Ask better science questions.
      </h1>

      <p className="mt-4 text-sm text-slate-400 sm:text-base">
        SciSeek gives structured, evidence-based answers with clear sections,
        key takeaways, and sources.
      </p>

      <div className="mt-8 grid gap-3">
        {examples.map((q) => (
          <button
            key={q}
            onClick={() => onAsk(q)}
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition-colors duration-150 hover:border-blue-400 hover:bg-white/10 hover:text-white"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function isToday(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  return date.toDateString() === now.toDateString();
}

function isYesterday(dateString: string) {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

function groupHistory(items: HistoryItem[]) {
  const today: HistoryItem[] = [];
  const yesterday: HistoryItem[] = [];
  const older: HistoryItem[] = [];

  items.forEach((item) => {
    if (isToday(item.createdAt)) {
      today.push(item);
    } else if (isYesterday(item.createdAt)) {
      yesterday.push(item);
    } else {
      older.push(item);
    }
  });

  return { today, yesterday, older };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [answerData, setAnswerData] = useState<AskResponse | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tier, setTier] = useState<"free" | "paid">("free");
  const [mode, setMode] = useState<"simple" | "standard" | "deep">("standard");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const savedHistory = localStorage.getItem("sciseek-history");

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as HistoryItem[];

        const normalized = Array.isArray(parsed)
          ? parsed.map((item) => ({
              ...item,
              createdAt: item.createdAt || new Date().toISOString(),
            }))
          : starterHistory;

        setHistoryItems(normalized);
      } catch {
        setHistoryItems(starterHistory);
      }
    } else {
      setHistoryItems(starterHistory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sciseek-history", JSON.stringify(historyItems));
  }, [historyItems]);

  function resizeTextarea() {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

  function handleNewQuestion() {
    setQuestion("");
    setAnswer(null);
    setAnswerData(null);
    setActiveQuestion(null);

    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.focus();
      }
    });
  }

  function handleHistoryClick(item: HistoryItem) {
    setQuestion(item.question);
    setAnswer(item.answer);
    setAnswerData(item.answerData ?? null);
    setActiveQuestion(item.question);

    requestAnimationFrame(() => {
      resizeTextarea();
    });
  }

  async function handleAskWithQuestion(questionText?: string) {
    const trimmedQuestion = (questionText ?? question).trim();
    if (!trimmedQuestion || isLoading) return;

    setQuestion(trimmedQuestion);
    setAnswer(null);
    setAnswerData(null);
    setActiveQuestion(null);
    setIsLoading(true);

    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        resizeTextarea();
        textareaRef.current.focus();
      }
    });

    let newAnswer = "";
    let newAnswerData: AskResponse | null = null;

    try {
      const res = await fetch("https://sciseek-backend.onrender.com/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          tier,
          mode,
        }),
      });

      const data: AskResponse = await res.json();

      if (!res.ok) {
        newAnswer = "Invalid request. Please adjust your question and try again.";
      }

      newAnswerData = data;

      if (data.refusal_message) {
        newAnswer = data.refusal_message;
      } else {
        const parts: string[] = [];

        if (data.hook) parts.push(data.hook);
        if (data.short_summary) parts.push(data.short_summary);

        if (data.sections?.length) {
          data.sections.forEach((section) => {
            parts.push(`${section.title}\n${section.body}`);
          });
        }

        if (data.key_points?.length) {
          parts.push(`Key points:\n- ${data.key_points.join("\n- ")}`);
        }

        newAnswer = parts.join("\n\n").trim();
      }

      if (!newAnswer) {
        newAnswer = "No answer was returned.";
      }
    } catch (error) {
      console.error("Ask request failed:", error);
      newAnswer = "Something went wrong. Please try again.";
      newAnswerData = null;
    } finally {
      setIsLoading(false);
    }

    setAnswer(newAnswer);
    setAnswerData(newAnswerData);
    setActiveQuestion(trimmedQuestion);

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      question: trimmedQuestion,
      answer: newAnswer,
      answerData: newAnswerData,
      createdAt: new Date().toISOString(),
    };

    setHistoryItems((prev) => {
      const withoutDuplicate = prev.filter(
        (item) => item.question.toLowerCase() !== trimmedQuestion.toLowerCase()
      );

      return [newItem, ...withoutDuplicate];
    });
  }

  async function handleAsk() {
    await handleAskWithQuestion();
  }

  function askRelatedQuestion(related: string) {
    setQuestion(related);
    setAnswer(null);
    setAnswerData(null);
    setActiveQuestion(null);

    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        resizeTextarea();
        textareaRef.current.focus();
      }
    });

    setTimeout(() => {
      handleAskWithQuestion(related);
    }, 0);
  }

  const answerAnimationKey = useMemo(() => {
    if (isLoading) return "loading";
    if (answerData) {
      return [
        activeQuestion ?? "",
        answerData.hook ?? "",
        answerData.short_summary ?? "",
        answerData.refusal_message ?? "",
      ].join("|");
    }
    if (answer) {
      return `${activeQuestion ?? ""}|${answer}`;
    }
    return "empty";
  }, [isLoading, answerData, answer, activeQuestion]);

  const answerMotionProps = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: {
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
      };

  const visibleHistory = historyItems.slice(0, DISPLAY_LIMIT);
  const { today, yesterday, older } = groupHistory(visibleHistory);

  return (
    <div ref={topRef} className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-80 shrink-0 border-r border-white/10 bg-slate-900 lg:flex lg:flex-col">
          <div className="border-b border-white/10 p-4">
            <button
              onClick={handleNewQuestion}
              className="w-full cursor-pointer rounded-xl bg-[var(--primary)] px-4 py-3 text-left text-sm font-medium text-black cursor-pointer transition hover:opacity-70"
            >
              + New Question
            </button>
          </div>

          <div className="border-b border-white/10 px-4 py-4">
            <div className="flex items-center gap-3">
              <SciSeekLogo className="h-11 w-11" />
              <div className="min-w-0">
                <div className="text-base font-semibold tracking-tight text-white">
                  <h1 className="logo-wordmark">Sci<span>Seek</span></h1>
                </div>
                <div className="text-xs text-slate-400">
                  Structured science answers
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-4 px-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Recent Questions
              </div>
              <div className="mt-2 h-px bg-white/10" />
            </div>

            <div className="space-y-5">
              {today.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 px-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                      Today
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="space-y-1.5">
                    {today.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistoryClick(item)}
                        className={`w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm leading-6 transition-colors duration-150 ${
                          activeQuestion === item.question
                            ? "bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                            : "text-white/75 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {yesterday.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 px-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                      Yesterday
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="space-y-1.5">
                    {yesterday.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistoryClick(item)}
                        className={`w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm leading-6 transition-colors duration-150 ${
                          activeQuestion === item.question
                            ? "bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                            : "text-white/75 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {older.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 px-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                      Older
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="space-y-1.5">
                    {older.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistoryClick(item)}
                        className={`w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm leading-6 transition-colors duration-150 ${
                          activeQuestion === item.question
                            ? "bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                            : "text-white/75 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {historyItems.length > DISPLAY_LIMIT && (
                <button className="cursor-pointer px-2 text-xs font-medium text-white/45 transition-colors duration-150 hover:text-white">
                  View all history →
                </button>
              )}
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <SciSeekLogo className="h-10 w-10 sm:h-12 sm:w-12" />
                <div className="min-w-0">
                  <div className="text-lg font-semibold tracking-tight text-white sm:text-2xl">
                    <h1 className="logo-wordmark">Sci<span>Seek</span></h1>
                  </div>
                  <div className="text-xs text-slate-400 sm:text-sm">
                    Search smarter. Understand deeper.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNewQuestion}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-colors duration-150 hover:bg-white/10 lg:hidden"
                >
                  New
                </button>

                <nav className="hidden items-center gap-2 md:flex">
                  <Link
                    href="/about"
                    className="rounded-lg px-3 py-2 text-sm text-white/70 transition-colors duration-150 hover:bg-white/5 hover:text-blue-300"
                  >
                    About
                  </Link>
                  <Link
                    href="/story"
                    className="rounded-lg px-3 py-2 text-sm text-white/70 transition-colors duration-150 hover:bg-white/5 hover:text-blue-300"
                  >
                    Story
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-lg px-3 py-2 text-sm text-white/70 transition-colors duration-150 hover:bg-white/5 hover:text-blue-300"
                  >
                    Contact
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-5xl flex-1 space-y-5 p-4 sm:space-y-6 sm:p-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-[0_0_0_1px_rgba(59,130,246,0.04),0_10px_30px_rgba(0,0,0,0.18)]">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-200">
                  Evidence-based
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-200">
                  Structured answers
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-200">
                  Sources included
                </span>
              </div>

              <textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
                placeholder="Ask anything scientific..."
                rows={1}
                className="w-full resize-none bg-transparent text-base text-white outline-none placeholder:text-slate-400 sm:text-[15px]"
              />

              <div className="mt-3 text-xs text-slate-400">
                Get a hook, summary, sections, key points, related questions, and
                citations.
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Tier
                    </label>
                    <select
                      value={tier}
                      onChange={(e) => {
                        const nextTier = e.target.value as "free" | "paid";
                        setTier(nextTier);

                        if (nextTier === "free" && mode === "deep") {
                          setMode("standard");
                        }
                      }}
                      className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>

                  <div className="h-4 w-px bg-white/10" />

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Mode
                    </span>

                    <div className="flex overflow-hidden rounded-lg border border-white/10 bg-slate-900">
                      {(["simple", "standard", "deep"] as const).map((m) => {
                        const isDisabled = tier === "free" && m === "deep";
                        const isActive = mode === m;

                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              if (!isDisabled) setMode(m);
                            }}
                            disabled={isDisabled}
                            className={`px-3 py-2 text-sm font-medium capitalize transition-colors duration-150 ${
                              isActive
                                ? "cursor-pointer bg-[var(--primary)] text-black"
                                : isDisabled
                                  ? "cursor-not-allowed text-white/30"
                                  : "cursor-pointer text-white/75 hover:bg-white/10 hover:text-white"
                            }`}
                            title={isDisabled ? "More detailed analysis (Paid)" : ""}
                          >
                            {m === "deep" && tier === "free"
                              ? "Deep 🔒"
                              : m === "simple"
                                ? "Basic"
                                : m}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAsk}
                  disabled={isLoading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-black cursor-pointer transition hover:opacity-70 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isLoading && (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  )}
                  {isLoading ? "Thinking..." : "Ask"}
                </button>
              </div>

              {isLoading && (
                <div className="mt-3 text-sm text-slate-400">Searching...</div>
              )}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {isLoading ? (
                <motion.div
                  key="loading"
                  {...answerMotionProps}
                  className="will-change-transform"
                >
                  <LoadingSkeleton />
                </motion.div>
              ) : answerData ? (
                <motion.div
                  key={answerAnimationKey}
                  {...answerMotionProps}
                  layout
                  className="space-y-6 will-change-transform"
                >
                  {answerData.refusal_message ? (
                    <motion.section
                      layout
                      variants={shouldReduceMotion ? undefined : itemVariants}
                      initial={shouldReduceMotion ? undefined : "hidden"}
                      animate={shouldReduceMotion ? undefined : "visible"}
                      className="rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6"
                    >
                      <div className="mb-2 text-sm text-slate-400">Answer</div>
                      <p className="leading-7">{answerData.refusal_message}</p>
                    </motion.section>
                  ) : (
                    <motion.div
                      variants={shouldReduceMotion ? undefined : containerVariants}
                      initial={shouldReduceMotion ? undefined : "hidden"}
                      animate={shouldReduceMotion ? undefined : "visible"}
                      className="space-y-6"
                    >
                      {(answerData.hook || answerData.short_summary) && (
                        <motion.section
                          layout
                          variants={shouldReduceMotion ? undefined : itemVariants}
                          className="rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_8px_30px_rgba(0,0,0,0.25)] sm:p-6"
                        >
                          {answerData.hook && (
                            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white">
                              {answerData.hook}
                            </h2>
                          )}

                          {answerData.short_summary && (
                            <p className="mt-3 leading-7 text-slate-200">
                              {answerData.short_summary}
                            </p>
                          )}
                        </motion.section>
                      )}

                      {answerData.sections && answerData.sections.length > 0 && (
                        <motion.section layout className="space-y-4">
                          {answerData.sections.map((section, index) => (
                            <motion.div
                              key={`${section.title}-${index}`}
                              layout
                              variants={shouldReduceMotion ? undefined : itemVariants}
                              className="rounded-2xl border border-white/10 bg-slate-900 p-4 transition-colors duration-150 hover:border-blue-400/50 sm:p-6"
                            >
                              <h3 className="text-lg font-semibold text-white">
                                {section.title}
                              </h3>
                              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-200">
                                {section.body}
                              </p>
                            </motion.div>
                          ))}
                        </motion.section>
                      )}

                      {answerData.key_points && answerData.key_points.length > 0 && (
                        <motion.section
                          layout
                          variants={shouldReduceMotion ? undefined : itemVariants}
                          className="rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6"
                        >
                          <h3 className="text-lg font-semibold text-white">
                            Key Points
                          </h3>
                          <ul className="mt-5 space-y-4">
                            {answerData.key_points.map((point, index) => (
                              <motion.li
                                key={`${point}-${index}`}
                                layout
                                variants={shouldReduceMotion ? undefined : itemVariants}
                                className="flex items-start gap-3"
                              >
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]" />
                                <span className="leading-7 text-slate-200">
                                  {point}
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.section>
                      )}

                      {answerData.related_questions &&
                        answerData.related_questions.length > 0 && (
                          <motion.section
                            layout
                            variants={shouldReduceMotion ? undefined : itemVariants}
                            className="rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6"
                          >
                            <h3 className="text-lg font-semibold text-white">
                              Related Questions
                            </h3>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {answerData.related_questions.map((related, index) => (
                                <motion.button
                                  key={`${related}-${index}`}
                                  layout
                                  variants={shouldReduceMotion ? undefined : itemVariants}
                                  onClick={() => askRelatedQuestion(related)}
                                  className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition-colors duration-150 hover:border-blue-400 hover:bg-white/10 hover:text-white"
                                >
                                  {related}
                                </motion.button>
                              ))}
                            </div>
                          </motion.section>
                        )}

                      {answerData.citations && answerData.citations.length > 0 && (
                        <motion.section
                          layout
                          variants={shouldReduceMotion ? undefined : itemVariants}
                          className="rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6"
                        >
                          <div className="mb-4 flex items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-white">
                              Sources
                            </h3>
                            <div className="text-xs uppercase tracking-wide text-slate-400">
                              {answerData.citations.length} source
                              {answerData.citations.length === 1 ? "" : "s"}
                            </div>
                          </div>

                          <div className="space-y-3">
                            {answerData.citations.map((citation, index) => {
                              const hostname = getHostname(citation.url);
                              const sourceLabel = citation.source || hostname;
                              const initial = getSourceInitial(
                                citation.source,
                                citation.url
                              );

                              return (
                                <motion.a
                                  key={`${citation.url}-${index}`}
                                  layout
                                  variants={shouldReduceMotion ? undefined : itemVariants}
                                  href={citation.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group block rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors duration-150 hover:border-blue-400 hover:bg-white/10 sm:p-4"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950 text-sm font-semibold text-white sm:h-10 sm:w-10">
                                      {initial}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                          <div className="line-clamp-2 text-sm font-medium leading-6 text-white">
                                            {citation.title}
                                          </div>

                                          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-slate-200">
                                              {sourceLabel}
                                            </span>
                                            <span className="text-slate-400">
                                              {hostname}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="shrink-0 text-slate-400 transition-colors duration-150 group-hover:text-blue-300">
                                          ↗
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.a>
                              );
                            })}
                          </div>
                        </motion.section>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ) : answer ? (
                <motion.div
                  key={answerAnimationKey}
                  {...answerMotionProps}
                  layout
                  className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-900 p-4 will-change-transform sm:p-6"
                >
                  <div className="mb-2 text-sm text-slate-400">Answer</div>
                  <p>{answer}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  {...answerMotionProps}
                  className="will-change-transform"
                >
                  <EmptyState onAsk={(q) => handleAskWithQuestion(q)} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <footer className="border-t border-white/10">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <SciSeekLogo className="h-9 w-9" />
                <div>
                  <div className="font-medium text-white/85"><h1 className="logo-wordmark">Sci<span>Seek</span></h1></div>
                  <div className="text-xs">
                    Structured science answers for curious minds.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link
                  href="/about"
                  className="transition-colors duration-150 hover:text-blue-300"
                >
                  About
                </Link>
                <Link
                  href="/story"
                  className="transition-colors duration-150 hover:text-blue-300"
                >
                  SciSeek Story
                </Link>
                <Link
                  href="/contact"
                  className="transition-colors duration-150 hover:text-blue-300"
                >
                  Contact
                </Link>
                <Link
                  href="/privacy"
                  className="transition-colors duration-150 hover:text-blue-300"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="transition-colors duration-150 hover:text-blue-300"
                >
                  Terms
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
