import { describe, it, expect } from "vitest";
import { InputSchema, OutputSchema } from "@/lib/schemas";

const validInput = {
  jobDescription: "A".repeat(50),
  currentRole: "Software Engineer",
  targetRole: "Senior Software Engineer",
  resumeText: "B".repeat(50),
  website: "",
  formStartedAt: Date.now() - 5000,
};

const validOutput = {
  jdAnalysis: {
    explicitRequirements: ["React", "TypeScript"],
    implicitRequirements: ["Communication skills"],
    problemsToSolve: ["Scale the frontend"],
  },
  linkedInOptimization: {
    headlineVariants: [
      { type: "Conservative" as const, text: "Software Engineer" },
      { type: "Bold" as const, text: "Full-Stack Builder" },
      { type: "Balanced" as const, text: "Engineer & Leader" },
    ],
    aboutSection: "A compelling about section.",
  },
  resumeOptimization: {
    bulletAnalysis: [
      {
        originalBullet: "Built APIs",
        relevanceScore: 4,
        rewriteSuggestion: "Designed and built REST APIs serving 1M requests/day",
        positioningNote: "Quantified impact",
      },
    ],
    gapAnalysis: [
      {
        gap: "No cloud experience listed",
        recommendation: "Highlight any AWS/GCP exposure",
      },
    ],
    atsKeywords: [
      {
        keyword: "React",
        status: "Found" as const,
        suggestion: "",
      },
      {
        keyword: "Kubernetes",
        status: "Missing" as const,
        suggestion: "Add Kubernetes if you have experience",
      },
    ],
  },
};

describe("InputSchema", () => {
  it("accepts valid input", () => {
    const result = InputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects an empty object", () => {
    const result = InputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects jobDescription shorter than 50 chars", () => {
    const result = InputSchema.safeParse({
      ...validInput,
      jobDescription: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects resumeText shorter than 50 chars", () => {
    const result = InputSchema.safeParse({
      ...validInput,
      resumeText: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects currentRole shorter than 2 chars", () => {
    const result = InputSchema.safeParse({
      ...validInput,
      currentRole: "A",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a non-empty honeypot field at schema layer", () => {
    const result = InputSchema.safeParse({
      ...validInput,
      website: "spam",
    });
    expect(result.success).toBe(true);
  });

  it("rejects jobDescription longer than 20000 chars", () => {
    const result = InputSchema.safeParse({
      ...validInput,
      jobDescription: "A".repeat(20001),
    });
    expect(result.success).toBe(false);
  });

  it("strips extra fields", () => {
    const result = InputSchema.safeParse({
      ...validInput,
      extraField: "should be stripped",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("extraField");
    }
  });
});

describe("OutputSchema", () => {
  it("accepts a valid complete output", () => {
    const result = OutputSchema.safeParse(validOutput);
    expect(result.success).toBe(true);
  });

  it("rejects headlineVariants with wrong length", () => {
    const result = OutputSchema.safeParse({
      ...validOutput,
      linkedInOptimization: {
        ...validOutput.linkedInOptimization,
        headlineVariants: [
          { type: "Conservative", text: "Only one" },
        ],
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid headline type", () => {
    const result = OutputSchema.safeParse({
      ...validOutput,
      linkedInOptimization: {
        ...validOutput.linkedInOptimization,
        headlineVariants: [
          { type: "Invalid", text: "Bad type" },
          { type: "Bold", text: "Ok" },
          { type: "Balanced", text: "Ok" },
        ],
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects relevanceScore outside 1-5 range", () => {
    const result = OutputSchema.safeParse({
      ...validOutput,
      resumeOptimization: {
        ...validOutput.resumeOptimization,
        bulletAnalysis: [
          {
            originalBullet: "Built APIs",
            relevanceScore: 10,
            rewriteSuggestion: "Improved bullet",
            positioningNote: "Note",
          },
        ],
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid atsKeywords status", () => {
    const result = OutputSchema.safeParse({
      ...validOutput,
      resumeOptimization: {
        ...validOutput.resumeOptimization,
        atsKeywords: [
          {
            keyword: "React",
            status: "Unknown",
            suggestion: "",
          },
        ],
      },
    });
    expect(result.success).toBe(false);
  });
});
