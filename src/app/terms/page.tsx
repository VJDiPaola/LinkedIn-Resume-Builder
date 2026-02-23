import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | ResumeTailor",
  description: "Terms of use for ResumeTailor by TeamVince.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Terms of Use</h1>
      <p className="mt-3 text-sm text-stone-500">Last updated: February 23, 2026</p>

      <section className="mt-8 space-y-4 text-sm leading-7 text-stone-700">
        <p>
          ResumeTailor is provided for informational and career-coaching support purposes only. You are responsible for reviewing and validating all generated suggestions before use.
        </p>
        <p>
          You may not use this service for unlawful activity, abuse, scraping, or attempts to disrupt availability. Automated abuse controls and rate limits may block suspicious traffic.
        </p>
        <p>
          This service is provided &quot;as is&quot; without warranties of any kind. TeamVince is not liable for losses resulting from use of generated output.
        </p>
        <p>
          By using ResumeTailor, you agree to these terms and the{" "}
          <Link className="underline underline-offset-2" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </section>

      <p className="mt-10 text-sm">
        <Link href="/" className="underline underline-offset-2 text-stone-700 hover:text-stone-900">
          Back to ResumeTailor
        </Link>
      </p>
    </main>
  );
}
