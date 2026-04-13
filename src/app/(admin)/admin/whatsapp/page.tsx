"use client";

import { useState } from "react";
import { Send, MessageCircle, Users, Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  { id: "welcome", name: "Bienvenida", preview: "Hola {nombre}! Tu cuenta está activa..." },
  { id: "reminder", name: "Recordatorio mensual", preview: "Hola {nombre}, es momento de revisar tus finanzas..." },
  { id: "upsell", name: "Upselling", preview: "Hola {nombre}, {producto} podría optimizar tu gestión..." },
  { id: "custom", name: "Mensaje personalizado", preview: "Escribe tu propio mensaje..." },
];

export default function AdminWhatsAppPage() {
  const [phone, setPhone] = useState("");
  const [clientName, setClientName] = useState("");
  const [template, setTemplate] = useState("welcome");
  const [customMsg, setCustomMsg] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSend() {
    if (!phone) return;
    setStatus("sending");
    setError("");

    try {
      const body: Record<string, string> = { to: phone };
      if (template === "custom") {
        body.body = customMsg.replace("{nombre}", clientName);
      } else {
        body.template = template;
        body.clientName = clientName;
        if (productName) body.productName = productName;
        if (price) body.price = price;
      }

      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("sent");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setError(data.error || "Error al enviar");
      }
    } catch {
      setStatus("error");
      setError("Error de conexión");
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white">WhatsApp Messaging</h1>
        <p className="text-sm text-slate-500 mt-1">Envía mensajes a clientes vía Twilio WhatsApp</p>
      </div>

      <div className="rounded-2xl bg-surface-800/60 border border-white/[0.06] p-6 space-y-5">
        {/* Phone */}
        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">Teléfono (con código país)</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+56912345678"
            className="w-full bg-surface-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none border border-white/[0.06] focus:ring-1 focus:ring-brand-500/40"
          />
        </div>

        {/* Client name */}
        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">Nombre del cliente</label>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Juan"
            className="w-full bg-surface-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none border border-white/[0.06] focus:ring-1 focus:ring-brand-500/40"
          />
        </div>

        {/* Template selector */}
        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">Plantilla</label>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={cn(
                  "p-3 rounded-xl text-left border transition-all",
                  template === t.id
                    ? "border-brand-500/40 bg-brand-600/10"
                    : "border-white/[0.06] bg-surface-700/40 hover:bg-surface-700"
                )}
              >
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{t.preview}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Conditional fields */}
        {template === "upsell" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Producto</label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Control Total" className="w-full bg-surface-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none border border-white/[0.06]" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Precio</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="$40.491" className="w-full bg-surface-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none border border-white/[0.06]" />
            </div>
          </div>
        )}

        {template === "custom" && (
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Mensaje (usa {"{nombre}"} para personalizar)</label>
            <textarea
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              rows={4}
              placeholder="Hola {nombre}, te escribimos de AnalitIA CFO..."
              className="w-full bg-surface-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none border border-white/[0.06] resize-none focus:ring-1 focus:ring-brand-500/40"
            />
          </div>
        )}

        {/* Status & Send */}
        {status === "error" && (
          <div className="flex items-center gap-2 px-4 py-2 bg-danger/10 text-danger text-sm rounded-xl">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!phone || status === "sending"}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
            status === "sent"
              ? "bg-success text-white"
              : "bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white"
          )}
        >
          {status === "sending" ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
          ) : status === "sent" ? (
            <><Check className="w-4 h-4" /> Mensaje Enviado</>
          ) : (
            <><Send className="w-4 h-4" /> Enviar WhatsApp</>
          )}
        </button>
      </div>
    </div>
  );
}
