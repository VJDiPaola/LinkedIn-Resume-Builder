"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { InputForm } from "@/components/InputForm";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ResultsSkeleton } from "@/components/ResultsSkeleton";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { InputType, OutputSchema } from "@/lib/schemas";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function Home() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);

  const { submit, isLoading, object, error } = useObject({
    api: "/api/optimize",
    schema: OutputSchema,
    onFinish: () => {
      console.log("Optimization complete.");
    },
    onError: (err: Error) => {
      console.error("Failed to stream optimization object:", err);
    }
  });

  const handleFormSubmit = (data: InputType) => {
    submit(data);
    setShowResults(true);

    // Smooth scroll to top when results appear
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const handleStartOver = () => {
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center pb-24">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 rounded-full w-[800px] h-[300px] bg-stone-200/40 blur-[120px] -translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 right-1/4 rounded-full w-[600px] h-[400px] bg-stone-300/20 blur-[150px] -z-10" />

      <main className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 flex flex-col items-center">

        {!showResults && (
          <>
            {/* Header Hero */}
            <div className="text-center max-w-3xl mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
              <div className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-500 mb-6">
                <Sparkles className="mr-2 h-4 w-4 text-stone-400" />
                <span className="font-medium text-stone-600">Powered by OpenAI GPT-5.2</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 pb-2">
                ResumeTailor
              </h1>
              <p className="mt-6 text-lg text-stone-500">
                Instantly tailor your resume and LinkedIn profile to any job description.
                Stop guessing, start iterating. Our Engine analyzes gaps and rewrites bullets to maximize relevance.
              </p>
            </div>

            {/* Form */}
            <div className="w-full max-w-3xl transition-all duration-700 ease-in-out">
              <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  <p className="font-semibold mb-1">Error processing request</p>
                  <p>{error.message}</p>
                  <p className="mt-2 text-xs opacity-80">Please try again later or contact support if the issue persists.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Results Area */}
        {showResults && (
          <div className="w-full" ref={resultsRef}>
            <button
              onClick={handleStartOver}
              className="mb-6 inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Start Over
            </button>
            {object ? (
              <ResultsDashboard data={object} />
            ) : (
              <ResultsSkeleton />
            )}
          </div>
        )}

      </main>

      <footer className="w-full text-center py-8 mt-auto">
        <p className="text-sm text-stone-400">
          Built by{" "}
          <a href="https://teamvince.com" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-900 font-medium transition-colors">
            teamvince
          </a>
        </p>
        <p className="mt-2 text-xs text-stone-400">
          <Link href="/terms" className="hover:text-stone-600 underline underline-offset-2">
            Terms
          </Link>
          {" · "}
          <Link href="/privacy" className="hover:text-stone-600 underline underline-offset-2">
            Privacy
          </Link>
        </p>
      </footer>
    </div>
  );
}
