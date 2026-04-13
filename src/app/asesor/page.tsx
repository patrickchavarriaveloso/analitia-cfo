"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

export default function AsesorPublicoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "¡Bienvenido a AnalitIA CFO! Soy tu asesor financiero con inteligencia artificial.\n\nPuedo ayudarte con consultas de contabilidad, finanzas, flujo de caja, impuestos y gestión financiera para PYMES en Chile.\n\n¿Qué necesitas resolver?",
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
          context: "sales",
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

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-surface-800 border-b border-white/[0.06] px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-xl font-extrabold text-white">
            Analit<span className="text-brand-500">IA</span>
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400">CFO</span>
        </div>
        <p className="text-xs text-slate-500">Asesor financiero IA para PYMES</p>
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
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            </div>
          </div>
        )}

        {messages.length <= 1 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-slate-600 px-1">Prueba preguntar:</p>
            {[
              "¿Cómo calculo mi margen neto?",
              "¿Qué impuestos paga una SpA en Chile?",
              "Necesito controlar mi flujo de caja",
              "¿Cómo evalúo la salud financiera de mi empresa?",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="block w-full text-left px-4 py-2.5 bg-surface-800/60 hover:bg-surface-800 border border-white/[0.06] rounded-xl text-sm text-slate-300 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-brand-400 inline mr-2" />{q}
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
            placeholder="Escribe tu consulta..."
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
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-[10px] text-slate-600">Powered by AnalitIA</p>
          <a
            href="/tienda"
            className="text-[10px] text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            Ver soluciones <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
