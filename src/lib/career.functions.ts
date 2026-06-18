import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

const ResumeInput = z.object({
  resumeText: z.string().min(40, "Resume text is too short"),
  targetRole: z.string().max(120).optional().default(""),
});

const ResumeSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  strengths: z.array(z.string()).max(8),
  weaknesses: z.array(z.string()).max(8),
  improvements: z.array(z.string()).max(8),
  atsRecommendations: z.array(z.string()).max(8),
  missingKeywords: z.array(z.string()).max(12),
});

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResumeInput.parse(input))
  .handler(async ({ data }) => {
    const { getGateway, DEFAULT_MODEL } = await import("./ai-gateway.server");
    const gateway = getGateway();
    const { output } = await generateText({
      model: gateway(DEFAULT_MODEL),
      output: Output.object({ schema: ResumeSchema }),
      system:
        "You are an expert career coach and ATS resume reviewer. Be specific, actionable, and constructive. Score 0-100 reflecting overall quality and ATS readiness.",
      prompt: `Analyze this resume${data.targetRole ? ` for the target role: ${data.targetRole}` : ""}.\n\nRESUME:\n${data.resumeText}`,
    });
    return output;
  });

const InterviewInput = z.object({
  role: z.string().min(2).max(120),
  industry: z.string().max(120).optional().default(""),
  level: z.enum(["entry", "mid", "senior"]).default("entry"),
});

const InterviewSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      category: z.string(),
      sampleAnswer: z.string(),
      tip: z.string(),
    }),
  ).max(8),
  preparationTips: z.array(z.string()).max(8),
});

export const generateInterviewPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InterviewInput.parse(input))
  .handler(async ({ data }) => {
    const { getGateway, DEFAULT_MODEL } = await import("./ai-gateway.server");
    const gateway = getGateway();
    const { output } = await generateText({
      model: gateway(DEFAULT_MODEL),
      output: Output.object({ schema: InterviewSchema }),
      system:
        "You are an interview coach. Generate realistic interview questions with strong STAR-format sample answers and a specific tip for each.",
      prompt: `Role: ${data.role}\nIndustry: ${data.industry || "general"}\nLevel: ${data.level}\nGenerate 6 questions: mix of behavioral, technical, and situational.`,
    });
    return output;
  });

const PlanInput = z.object({
  currentRole: z.string().max(160).optional().default(""),
  targetRole: z.string().min(2).max(160),
  experience: z.string().max(80).optional().default(""),
  interests: z.string().max(400).optional().default(""),
});

const PlanSchema = z.object({
  overview: z.string(),
  milestones: z.array(
    z.object({
      timeframe: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  ).max(6),
  skillsToLearn: z.array(z.string()).max(10),
  certifications: z.array(
    z.object({
      name: z.string(),
      provider: z.string(),
      why: z.string(),
    }),
  ).max(6),
  recommendedResources: z.array(z.string()).max(8),
});

export const buildCareerPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) => {
    const { getGateway, DEFAULT_MODEL } = await import("./ai-gateway.server");
    const gateway = getGateway();
    const { output } = await generateText({
      model: gateway(DEFAULT_MODEL),
      output: Output.object({ schema: PlanSchema }),
      system:
        "You are a long-term career strategist. Produce realistic, actionable roadmaps with concrete milestones and well-known certifications.",
      prompt: `Current role: ${data.currentRole || "student / early career"}
Target role: ${data.targetRole}
Years of experience: ${data.experience || "unspecified"}
Interests / context: ${data.interests || "n/a"}

Build a 12-24 month career roadmap.`,
    });
    return output;
  });
