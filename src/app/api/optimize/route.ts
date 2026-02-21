import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { OutputSchema } from "@/lib/schemas";

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { jobDescription, currentRole, targetRole, resumeText } = body;

        if (!jobDescription || !resumeText) {
            return new Response("Missing required fields", { status: 400 });
        }

        const systemPrompt = `You are a world-class executive career coach and resume writer. 
Your task is to analyze the provided job description and user profile, and then generate a detailed optimization plan.
Perform a deep analysis of the job, then use that analysis to generate tailored LinkedIn content and specific, actionable resume recommendations.
You must return only the JSON output strictly adhering to the schema provided.`;

        const userPrompt = `**[INPUTS]**

**1. Job Description:**
${jobDescription}

**2. User Profile:**
- Current Role: ${currentRole}
- Target Role: ${targetRole}

**3. Current Resume Text:**
${resumeText}
`;

        const result = streamObject({
            model: openai("gpt-4o"),
            schema: OutputSchema,
            system: systemPrompt,
            prompt: userPrompt,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Optimization error:", error);
        return new Response("An error occurred during optimization.", { status: 500 });
    }
}
