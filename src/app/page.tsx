"use client";

import { useRef } from "react";
import { InputForm } from "@/components/InputForm";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { OutputSchema } from "@/lib/schemas";
import { Sparkles } from "lucide-react";

export default function Home() {
  const resultsRef = useRef<HTMLDivElement>(null);

  const { submit, isLoading, object, error } = useObject({
    api: "/api/optimize",
    schema: OutputSchema,
    onFinish: (result: any) => {
      console.log("Optimization complete.");
    },
    onError: (err: Error) => {
      console.error("Failed to stream optimization object:", err);
    }
  });

  const handleFormSubmit = (data: any) => {
    submit(data);

    // Smooth scroll to results after a short delay
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center pb-24">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 rounded-full w-[800px] h-[300px] bg-indigo-600/20 blur-[120px] -translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 right-1/4 rounded-full w-[600px] h-[400px] bg-purple-600/10 blur-[150px] -z-10" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 flex flex-col items-center">

        {/* Header Hero */}
        <div className="text-center max-w-3xl mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-300 mb-6 backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
            <span className="font-medium text-indigo-200">Powered by OpenAI gpt-4o</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500 pb-2">
            AI-Powered Career Optimization
          </h1>
          <p className="mt-6 text-lg text-zinc-400">
            Instantly tailor your resume and LinkedIn profile to any job description.
            Stop guessing, start iterating. Our Engine analyzes gaps and rewrites bullets to maximize relevance.
          </p>
        </div>

        {/* Dynamic Form Layout */}
        <div className={`w-full transition-all duration-700 ease-in-out ${object ? 'max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start' : 'max-w-3xl'}`}>
          <div className={`${object ? 'lg:col-span-4 sticky top-6' : 'w-full'} z-10`}>
            <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <p className="font-semibold mb-1">Error processing request</p>
                <p>{error.message}</p>
                <p className="mt-2 text-xs opacity-80">Did you add your OPENAI_API_KEY to .env.local?</p>
              </div>
            )}
          </div>

          {/* Results Area */}
          {object && (
            <div className="lg:col-span-8 w-full" ref={resultsRef}>
              <ResultsDashboard data={object} />
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
