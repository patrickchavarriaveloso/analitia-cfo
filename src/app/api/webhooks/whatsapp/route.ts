import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { FINANCIAL_ADVISOR_PROMPT } from "@/lib/ai-prompts";

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WA = process.env.TWILIO_WHATSAPP_NUMBER;

async function sendWhatsApp(to: string, body: string) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");

  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      From: TWILIO_WA!,
      To: to,
      Body: body,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get("From") as string;
    const body = formData.get("Body") as string;

    if (!body || !from) {
      return new NextResponse("OK", { status: 200 });
    }

    // Generar respuesta con IA
    let aiResponse = "Gracias por escribirnos. En este momento nuestro asistente no está disponible. Puedes contactarnos en contacto@analitia.cl";

    if (process.env.ANTHROPIC_API_KEY) {
      const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const { text } = await generateText({
        model: anthropic("claude-sonnet-4-20250514"),
        system: FINANCIAL_ADVISOR_PROMPT + "\n\nResponde de forma breve (máximo 500 caracteres) ya que es un mensaje de WhatsApp.",
        messages: [{ role: "user", content: body }]
      });
      aiResponse = text;
    }

    // Enviar respuesta por WhatsApp
    await sendWhatsApp(from, aiResponse);

    // Twilio espera TwiML o 200 OK
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { status: 200, headers: { "Content-Type": "text/xml" } }
    );
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return new NextResponse("OK", { status: 200 });
  }
}
