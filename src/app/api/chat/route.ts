import { NextRequest, NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { SALES_AGENT_PROMPT, FINANCIAL_ADVISOR_PROMPT, SUPPORT_AGENT_PROMPT } from "@/lib/ai-prompts";

const PROMPTS: Record<string, string> = {
  sales: SALES_AGENT_PROMPT,
  support: SUPPORT_AGENT_PROMPT,
  financial_advisor: FINANCIAL_ADVISOR_PROMPT,
};

export async function POST(req: NextRequest) {
  try {
    const { messages, context = "sales" } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        response:
          "El asistente IA no está configurado aún. Contacta a contacto@analitia.cl para más información.",
      });
    }

    const systemPrompt = PROMPTS[context] || SALES_AGENT_PROMPT;

    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))
    });

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { response: "Hubo un error procesando tu mensaje. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
