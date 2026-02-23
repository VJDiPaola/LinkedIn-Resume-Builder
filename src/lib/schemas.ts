import { z } from "zod";

export const InputSchema = z.object({
  jobDescription: z.string().min(50, "Please provide a longer job description.").max(20000, "Job description is too long."),
  currentRole: z.string().min(2, "Current role is required.").max(200, "Current role is too long."),
  targetRole: z.string().min(2, "Target role is required.").max(200, "Target role is too long."),
  resumeText: z.string().min(50, "Please paste your resume text.").max(20000, "Resume text is too long.")
});

export const OutputSchema = z.object({
  jdAnalysis: z.object({
    explicitRequirements: z.array(z.string()).describe("Short, specific skills and qualifications directly stated in the JD (e.g. '5+ years Python', 'Series B fundraising experience')"),
    implicitRequirements: z.array(z.string()).describe("Brief implied soft skills or unstated expectations inferred from the JD (e.g. 'Cross-functional communication', 'Comfort with ambiguity')"),
    problemsToSolve: z.array(z.string()).describe("The core business problems this role is being hired to solve")
  }),
  linkedInOptimization: z.object({
    headlineVariants: z.array(z.object({
      type: z.enum(["Conservative", "Bold", "Balanced"]),
      text: z.string()
    })).length(3).describe("Three variants of a LinkedIn headline"),
    aboutSection: z.string().describe("A compelling 2-3 paragraph LinkedIn About section tailored to the target role")
  }),
  resumeOptimization: z.object({
    bulletAnalysis: z.array(z.object({
      originalBullet: z.string(),
      relevanceScore: z.number().min(1).max(5).describe("Score from 1 (irrelevant) to 5 (highly matched)"),
      rewriteSuggestion: z.string().describe("An improved, impact-focused rewrite of the bullet tailored to the JD"),
      positioningNote: z.string().describe("Brief note explaining why this rewrite is effective")
    })).describe("Analysis and rewriting of the provided resume bullets"),
    gapAnalysis: z.array(z.object({
      gap: z.string().describe("A gap between the user's experience and the JD requirements"),
      recommendation: z.string().describe("How to address or frame this gap during the interview process")
    })).describe("Identifying missing skills or experiences"),
    atsKeywords: z.array(z.object({
      keyword: z.string(),
      status: z.enum(["Found", "Missing"]),
      suggestion: z.string().describe("Suggestion for incorporating the keyword, or empty string if not applicable")
    })).describe("Important keywords extracted from the JD and whether they exist in the targeted resume")
  })
});

export type InputType = z.infer<typeof InputSchema>;
export type OutputType = z.infer<typeof OutputSchema>;
