import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, Sparkles, RefreshCw, BookmarkPlus } from "lucide-react";
import { saveFile } from "@/lib/files-store";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { AIDisclaimer } from "@/components/AIDisclaimer";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Career Assistant — CareerBoost AI" },
      { name: "description", content: "Chat with an AI career coach for job search guidance, learning resources, and professional development." },
      { property: "og:title", content: "AI Career Assistant — CareerBoost AI" },
      { property: "og:description", content: "Chat 24/7 with your AI career coach." },
    ],
  }),
  component: ChatPage,
});

const STORAGE_KEY = "careerboost-chat-v1";

const suggestions = [
  "How do I find my first job after graduation?",
  "What skills should I learn to become a data analyst?",
  "Help me write a cover letter for a marketing internship",
  "How do I prepare for a behavioral interview?",
];

function loadInitial(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function ChatPage() {
  const initial = useMemo(() => loadInitial(), []);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: "careerboost-main",
    messages: initial,
    transport,
    onError: (err) => toast.error(err.message || "Chat error"),
  });

  // Persist to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore quota errors */
    }
  }, [messages]);

  // Auto-focus textarea
  useEffect(() => {
    textareaRef.current?.focus();
  }, [status]);

  const isBusy = status === "submitted" || status === "streaming";

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || isBusy) return;
    setInput("");
    await sendMessage({ text: t });
  };

  const onSubmit = (message: { text: string }) => {
    send(message.text || input);
  };

  const reset = () => {
    setMessages([]);
    setInput("");
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem-1px)] max-w-4xl flex-col px-4 py-4 sm:px-6 sm:py-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-soft">
            <Bot className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-bold">AI Career Assistant</h1>
            <p className="truncate text-xs text-muted-foreground">Your 24/7 coach for job search, growth, and learning</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={reset}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" /> New chat
          </button>
        )}
      </header>

      <Conversation className="flex-1 rounded-3xl border border-border bg-card/40">
        <ConversationContent className="px-3 sm:px-5">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<Sparkles className="h-6 w-6 text-primary" />}
              title="How can I help your career today?"
              description="Ask about job search, career planning, skill-building, interviews, or anything else."
            >
              <div className="mt-4 grid w-full max-w-xl gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-all hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            <>
              {messages.map((m) => {
                const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
                return (
                  <Message key={m.id} from={m.role === "user" ? "user" : "assistant"}>
                    {m.role === "assistant" ? (
                      <div className="group/msg relative">
                        <div className="prose prose-sm max-w-none text-foreground prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:before:content-none prose-code:after:content-none">
                          <ReactMarkdown>{text}</ReactMarkdown>
                        </div>
                        {text.trim().length > 0 && (
                          <button
                            onClick={() => {
                              const title = text.trim().split("\n")[0].replace(/^#+\s*/, "").slice(0, 60) || "Saved answer";
                              saveFile({ title, source: "chat", content: text });
                              toast.success("Saved to Files");
                            }}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <BookmarkPlus className="h-3 w-3" /> Save to Files
                          </button>
                        )}
                      </div>
                    ) : (
                      <MessageContent>
                        {m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null))}
                      </MessageContent>
                    )}
                  </Message>
                );
              })}
              {status === "submitted" && (
                <Message from="assistant">
                  <Shimmer>Thinking...</Shimmer>
                </Message>
              )}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="pt-4">
        <PromptInput onSubmit={onSubmit}>
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your career..."
            disabled={false}
          />
          <PromptInputFooter className="justify-between">
            <span className="px-1 text-[11px] text-muted-foreground">AI guidance only — please verify important decisions.</span>
            <PromptInputSubmit status={status} disabled={!input.trim() || isBusy} />
          </PromptInputFooter>
        </PromptInput>
        <AIDisclaimer className="mt-3 sm:hidden" />
      </div>
    </div>
  );
}
