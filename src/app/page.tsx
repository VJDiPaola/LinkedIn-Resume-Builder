"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { InputForm } from "@/components/InputForm";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ResultsSkeleton } from "@/components/ResultsSkeleton";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { InputType, OutputSchema } from "@/lib/schemas";
import { Sparkles, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function Home() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [completedAt, setCompletedAt] = useState<Date | null>(null);

  const { submit, isLoading, object, error } = useObject({
    api: "/api/optimize",
    schema: OutputSchema,
    onFinish: () => {
      setCompletedAt(new Date());
      console.log("Optimization complete.");
    },
    onError: (err: Error) => {
      setShowResults(false);
      setCompletedAt(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.error("Failed to stream optimization object:", err);
    }
  });

  const handleFormSubmit = (data: InputType) => {
    setCompletedAt(null);
    submit(data);
    setShowResults(true);

    // Smooth scroll to top when results appear
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const handleStartOver = () => {
    setShowResults(false);
    setCompletedAt(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const errorMessage = error?.message ?? "";
  const lowerErrorMessage = errorMessage.toLowerCase();
  const isRateLimited =
    lowerErrorMessage.includes("rate_limit_exceeded") ||
    lowerErrorMessage.includes("too many requests") ||
    lowerErrorMessage.includes("429");

  const jdSectionComplete = Boolean(
    object?.jdAnalysis?.explicitRequirements?.length &&
    object?.jdAnalysis?.implicitRequirements?.length &&
    object?.jdAnalysis?.problemsToSolve?.length
  );
  const linkedInSectionComplete = Boolean(
    object?.linkedInOptimization?.headlineVariants?.length &&
    object?.linkedInOptimization?.aboutSection
  );
  const resumeSectionComplete = Boolean(
    object?.resumeOptimization?.bulletAnalysis?.length &&
    object?.resumeOptimization?.atsKeywords?.length &&
    object?.resumeOptimization?.gapAnalysis?.length
  );

  const sectionProgress = [
    { label: "JD Analysis", complete: jdSectionComplete },
    { label: "LinkedIn Content", complete: linkedInSectionComplete },
    { label: "Resume Optimization", complete: resumeSectionComplete },
  ];
  const completedSections = sectionProgress.filter((section) => section.complete).length;
  const completedTime = completedAt
    ? completedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : null;
  const processingStatusLabel = isLoading
    ? completedSections > 0
      ? `Still generating output (${completedSections}/3 sections ready)...`
      : "Analyzing your inputs and generating recommendations..."
    : object
      ? completedTime
        ? `All sections generated at ${completedTime}.`
        : "All sections generated."
      : "Ready to generate results.";

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
                  <p className="font-semibold mb-1">{isRateLimited ? "Rate limit reached" : "Error processing request"}</p>
                  <p>
                    {isRateLimited
                      ? "You've reached the request limit. Please wait 60 seconds, then try again."
                      : errorMessage}
                  </p>
                  <p className="mt-2 text-xs opacity-80">
                    {isRateLimited
                      ? "If this keeps happening unexpectedly, try again in an incognito window or clear site cookies."
                      : "Please try again later or contact support if the issue persists."}
                  </p>
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

            <div className="mb-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm" role="status" aria-live="polite">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-stone-700">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-stone-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                  <span>{processingStatusLabel}</span>
                </div>
                <span className="text-xs text-stone-500">{completedSections}/3 sections ready</span>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sectionProgress.map((section) => (
                  <div
                    key={section.label}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${
                      section.complete
                        ? "border-green-200 bg-green-50 text-green-700"
                        : isLoading
                          ? "border-stone-200 bg-stone-50 text-stone-600"
                          : "border-stone-200 bg-white text-stone-500"
                    }`}
                  >
                    <span>{section.label}</span>
                    <span className="font-semibold">{section.complete ? "Done" : isLoading ? "Generating" : "Not Generated"}</span>
                  </div>
                ))}
              </div>
            </div>

            {object ? (
              <ResultsDashboard data={object} isStreaming={isLoading} />
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
          {" | "}
          <Link href="/privacy" className="hover:text-stone-600 underline underline-offset-2">
            Privacy
          </Link>
        </p>
      </footer>
    </div>
  );
}
