# Case Study: LinkedIn Resume Builder

**An AI-Powered Career Optimization Tool Built with Next.js and the Vercel AI SDK**

---

## Overview

LinkedIn Resume Builder is a single-page web application that uses large language models to help job seekers tailor their resumes and LinkedIn profiles to specific job descriptions. In one submission, the tool performs job description analysis, resume bullet rewriting, ATS keyword extraction, LinkedIn headline generation, and gap analysis — all delivered as a real-time streaming response.

---

## The Problem

Job applications are a volume game, but generic materials lose to tailored ones. Most candidates face the same three-part challenge:

1. **ATS filters** — Applicant Tracking Systems score resumes against job descriptions using keyword matching before a human ever reads them.
2. **Positioning mismatch** — Even qualified candidates fail to frame their experience in terms of the specific problems a role is trying to solve.
3. **LinkedIn discoverability** — Recruiters search by keywords, and most profiles are not written to surface for the right searches.

Doing this tailoring manually for every application is time-intensive. The goal of this project was to automate the research, rewriting, and optimization work into a single AI-driven workflow.

---

## Solution Architecture

The application is a lean, focused tool built on three layers:

**1. A single-page Next.js frontend**
The UI presents an input form, submits it to the backend, then replaces the form with a structured results dashboard. There are no routes to navigate, no accounts to manage, and no database. The experience is intentionally minimal.

**2. A streaming API route**
A single `POST /api/optimize` endpoint accepts the user's inputs, validates them with Zod, then calls the OpenAI API using Vercel's `streamObject` method. The response is a structured JSON object that streams progressively to the client — users see results fill in as the model generates them rather than waiting for a full response before anything renders.

**3. A schema-driven output contract**
The AI's output is constrained by a Zod schema that defines every field the model is expected to return — bullet rewrites, relevance scores, headline variants, ATS keywords, and more. This schema is used for both runtime validation and TypeScript type inference, so the frontend receives fully typed data without any manual casting.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript 5 |
| AI Integration | Vercel AI SDK (`streamObject`) |
| Model | GPT-5 Mini (OpenAI) |
| Validation | Zod v4 |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |

---

## Key Technical Decisions

### Structured Streaming Over Simple Completion

The application uses `streamObject` from the Vercel AI SDK rather than a standard chat completion. This means the model returns a typed JSON object — not free-form text — and that object streams to the client progressively as it is generated.

This was the right call for this use case for two reasons. First, it gives the frontend a clear, predictable data contract — every field has a known shape and the component tree knows exactly how to render it without parsing logic. Second, it dramatically improves perceived performance. A full analysis can take 15–30 seconds to generate. With streaming, users start reading job description insights within a few seconds while the resume bullets and LinkedIn content continue rendering behind them.

### Schema-First Design with Zod

Both the input and output are defined as Zod schemas in `src/lib/schemas.ts`. The input schema enforces field lengths and required values before any token is sent to the API. The output schema defines the expected structure of the AI response, which Vercel's SDK uses to constrain and validate the model's output.

This approach eliminated an entire class of runtime bugs. Without an output schema, the model might occasionally return a field with the wrong type, omit an optional field, or return a string where an array was expected. By declaring the contract explicitly, those failures surface as validation errors rather than silent rendering issues.

### Client-Side State with `useObject`

Rather than managing streaming state manually with `useEffect` and `fetch`, the application uses the `experimental_useObject` hook from `@ai-sdk/react`. This hook handles the streaming lifecycle — open connection, parse partial JSON, accumulate state, close on completion — and exposes a clean interface: `{ submit, isLoading, object, error }`.

The resulting component code is straightforward. The form calls `submit()` on submission. The results dashboard reads from `object`. Loading and error states are handled by the hook without any imperative lifecycle management.

### Component Separation

The two main business components — `InputForm` and `ResultsDashboard` — are cleanly separated. The parent page component holds state and manages the transition between them. `InputForm` owns only form field state and a submit handler. `ResultsDashboard` is a pure display component that receives the `object` from the hook and renders it.

This made iterating on the results layout straightforward. The display logic could be changed without touching the form or the API integration.

### shadcn/ui Over a Full Component Library

shadcn/ui installs component source directly into the project rather than importing from a package. This means components are fully customizable without override patterns or specificity battles. Combined with Tailwind CSS v4 and OKLCH color tokens, the entire visual language is defined in CSS variables and utility classes — there is no separate theme file to maintain.

---

## Application Features

### Job Description Analysis
The model extracts three layers from the job description: explicit requirements (stated skills and qualifications), implicit focus areas (soft skills and cultural signals the JD implies but doesn't state directly), and the core business problems the role exists to solve. This framing — problems to solve — gives users language to use in interviews and cover letters.

### Resume Bullet Rewriting
For each bullet point in the user's resume, the model returns a rewritten version optimized for the target role, a relevance score from 1–5, and a positioning note explaining the reasoning behind the rewrite. Scores are color-coded in the UI (green for high relevance, red for low) so users can prioritize which bullets to update.

### ATS Keyword Analysis
The tool extracts high-value keywords from the job description and checks whether they appear in the user's resume. Each keyword is shown with a status badge indicating whether it is present or missing, along with a suggestion for how to naturally incorporate missing keywords.

### LinkedIn Content Generation
The model generates three headline variants — conservative, bold, and balanced — each representing a different positioning strategy for the same candidate. It also writes a tailored About section. All generated content includes one-click copy-to-clipboard functionality.

### Gap Analysis
The tool surfaces skills and experience gaps between the user's current profile and the target role, paired with specific recommendations for how to address or frame those gaps before an interview.

---

## What Worked Well

**The streaming UX made the wait feel shorter.** An analysis that takes 20 seconds to complete feels much faster when the first results appear in 3–4 seconds. Users have something to read and react to immediately while the rest of the response continues filling in.

**The schema constraint on the model output was essential.** Early iterations without a strict output schema produced inconsistent results — fields missing, wrong types, and arrays returned as strings. Zod schemas fed into `streamObject` resolved this almost entirely.

**GPT-5 Mini was the right model choice.** For structured extraction and rewriting tasks with a well-defined prompt, GPT-5 Mini delivers quality results at substantially lower cost and latency than larger models. The output schema further constrains the model's behavior, making the smaller model more reliable for this specific use case than it would be in open-ended generation.

**shadcn/ui accelerated the front-end build significantly.** Having accessible, styled primitives (Card, Badge, ScrollArea, Tabs) available from day one meant UI development was almost entirely composition — assembling existing components — rather than building from scratch.

---

## Tradeoffs and Constraints

**No persistence.** Results are not saved. If the user closes or refreshes the page, they lose their output. For a portfolio or MVP tool this is acceptable, but it would be the first thing to address for a production product — even lightweight localStorage caching would meaningfully improve the experience.

**Single-request architecture limits depth.** All analysis is done in one API call. This keeps the implementation simple but means there is a hard ceiling on how deep the analysis can go. A multi-step agentic approach — where the model first analyzes the JD, then rewrites bullets, then generates LinkedIn content as separate calls — could produce higher-quality output at the cost of additional complexity and latency.

**No authentication.** Anyone with the URL can use the API. For a deployed version, rate limiting and API key protection would be necessary to prevent abuse and manage cost.

**60-second API timeout.** The API route sets a 60-second max duration. For long resumes or complex job descriptions, this is occasionally tight. Edge runtime or a queue-based approach would be needed for production scale.

---

## Project Scale

- **Pages:** 1
- **API Routes:** 1
- **Business Components:** 2 (`InputForm`, `ResultsDashboard`)
- **UI Primitives:** 9 (shadcn)
- **Schema Definitions:** 2 (input, output)
- **External Dependencies:** OpenAI API
- **Estimated Lines of Code:** ~900 (excluding generated files and node_modules)
- **Build Time:** ~3 seconds

---

## Outcome

The project demonstrates that a well-scoped AI tool can be built to a production-quality UX standard with a very small codebase when the right abstractions are chosen. The Vercel AI SDK's `streamObject` method, combined with Zod schema validation and Next.js App Router, handles most of the complexity that would otherwise require custom streaming logic, response parsing, and error handling infrastructure.

The application is a clear example of what is now possible in a short build cycle: a focused AI tool that solves a real problem, delivers results in real time, and requires no backend infrastructure beyond a single API route.

---

*Built with Next.js, Vercel AI SDK, OpenAI GPT-5 Mini, shadcn/ui, and Tailwind CSS.*
