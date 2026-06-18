import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "@/lib/ai-gateway.server";

type ChatBody = { messages?: unknown };

const SYSTEM_PROMPT = `You are the CareerBoost AI Career Assistant — a warm, encouraging, and pragmatic career coach for students, recent graduates, and job seekers.

You help with:
- Career exploration and planning
- Job search strategy and applications
- Resume, cover letter, and LinkedIn guidance
- Interview preparation
- Skill development and learning resources (courses, certifications, communities)
- Professional development and workplace navigation

Style:
- Use clear, friendly markdown with short paragraphs, bullet lists, and bold for emphasis.
- Be specific and actionable. Recommend real, well-known resources (Coursera, edX, freeCodeCamp, LinkedIn Learning, Google certificates, etc.) when relevant.
- Ask brief clarifying questions when the request is too vague.
- Always remind users that AI suggestions are guidance and to verify important decisions with humans or trusted sources when appropriate.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway(DEFAULT_MODEL),
          system: SYSTEM_PROMPT,
          messages: convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
