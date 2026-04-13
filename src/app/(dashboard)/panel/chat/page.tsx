"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

export default function ClientChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "¡Hola! Soy tu asesor financiero IA de AnalitIA. Puedo ayudarte con:\n\n• Analizar tus ingresos y gastos\n• Calcular indicadores financieros (liquidez, rentabilidad, márgenes)\n• Responder preguntas sobre contabilidad\n• Recomendaciones para mejorar tu flujo de caja\n\n¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          context: "financial_advisor",
        }),
      });
      const data = await res.json();
      setMessages((p) => [
        ...p,
        { role: "assistant", content: data.response || "Error procesando tu consulta." },
      ]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Error de conexión." }]);
    } finally {
      setLoading(false);
    }
  }

  const quickPrompts = [
    "¿Cómo puedo mejorar mi flujo de caja?",
    "Explícame qué es el margen bruto",
    "¿Qué indicadores debo monitorear?",
    "Ayúdame a planificar mis finanzas",
  ];

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="glass border-b border-white/[0.06] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <div className="w-10 h-10 rounded-full bg-brand-600/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-brand-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">AnalitIA CFO</p>
          <p className="text-[11px] text-cyan-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            Asesor financiero IA
          </p>
        </div>
        <a
          href="/panel"
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-slate-300 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3 h-3" /> Panel
        </a>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "")}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === "user" ? "bg-brand-600/20" : "bg-cyan-500/15"
            )}>
              {msg.role === "user" ? <User className="w-4 h-4 text-brand-400" /> : <Bot className="w-4 h-4 text-cyan-400" />}
            </div>
            <div className={cn(
              "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
              msg.role === "user"
                ? "bg-brand-600 text-white rounded-tr-md"
                : "bg-surface-800 text-slate-200 rounded-tl-md border border-white/[0.06]"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/15 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="bg-surface-800 border border-white/[0.06] px-4 py-3 rounded-2xl rounded-tl-md">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs text-slate-500">Analizando...</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick prompts (only show at start) */}
        {messages.length <= 1 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-slate-600 px-1">Preguntas sugeridas:</p>
            {quickPrompts.map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="block w-full text-left px-4 py-2.5 bg-surface-800/60 hover:bg-surface-800 border border-white/[0.06] rounded-xl text-sm text-slate-300 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-brand-400 inline mr-2" />
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 p-3 border-t border-white/[0.06] bg-surface-900/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Escribe tu consulta financiera..."
            className="flex-1 bg-surface-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-brand-500/50 border border-white/[0.06]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 rounded-xl transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-2">
          AnalitIA CFO · Asesor IA · No reemplaza consejo profesional
        </p>
      </div>
    </div>
  );
}
