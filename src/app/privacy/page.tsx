import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | ResumeTailor",
  description: "Privacy policy for ResumeTailor by TeamVince.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Privacy Policy</h1>
      <p className="mt-3 text-sm text-stone-500">Last updated: February 23, 2026</p>

      <section className="mt-8 space-y-4 text-sm leading-7 text-stone-700">
        <p>
          ResumeTailor collects only the text you submit (job descriptions, resume content, and role inputs) so the app can generate optimization results.
        </p>
        <p>
          Submitted text is sent to OpenAI to produce analysis output. Avoid including highly sensitive personal information such as Social Security numbers, bank details, or account passwords.
        </p>
        <p>
          We use technical data such as IP-based rate-limit keys and session cookies to protect the service from abuse. We do not sell your personal information.
        </p>
        <p>
          For requests about this policy, contact{" "}
          <a className="underline underline-offset-2" href="https://teamvince.com" target="_blank" rel="noopener noreferrer">
            teamvince.com
          </a>
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
