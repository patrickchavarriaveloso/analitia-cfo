// ============================================
// INTEGRACIÓN CON ANALITIA.CL (WEBSITE PRINCIPAL)
// ============================================
// Agrega este archivo a tu proyecto de AnalitIA en:
// /Users/Patri/Documents/AnalitIA/website/src/components/CFOBanner.tsx
//
// Luego impórtalo en tu landing page donde quieras mostrar
// el banner de AnalitIA CFO.
//
// import { CFOBanner } from "@/components/CFOBanner";
// ...
// <CFOBanner />

"use client";

import { motion } from "framer-motion";

const CFO_URL = process.env.NEXT_PUBLIC_CFO_URL || "https://cfo.analitia.cl";

export function CFOBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-20 px-6"
    >
      <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, rgba(13,109,225,0.15) 0%, rgba(6,182,212,0.1) 100%)",
          border: "1px solid rgba(6,182,212,0.15)",
        }}
      >
        <div className="p-10 md:p-14 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
            style={{
              background: "rgba(6,182,212,0.1)",
              border: "1px solid rgba(6,182,212,0.2)",
              color: "#22d3ee",
            }}
          >
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Nuevo módulo disponible
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            AnalitIA <span style={{ color: "#22d3ee" }}>CFO</span>
          </h2>
          <p className="text-lg text-slate-300 mb-3 max-w-2xl">
            Tu CFO virtual impulsado por inteligencia artificial.
          </p>
          <p className="text-slate-400 mb-8 max-w-2xl">
            Sistemas financieros inteligentes para PYMES: contabilidad automatizada,
            flujo de caja, presupuestos, evaluación de créditos, métricas SaaS y más.
            Todo con un agente IA que te asesora 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`${CFO_URL}/tienda`}
              className="px-8 py-3.5 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              style={{ background: "#0d6de1" }}
            >
              Ver Soluciones CFO
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </a>
            <a
              href={`${CFO_URL}/asesor`}
              className="px-8 py-3.5 rounded-xl text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Probar Asesor IA Gratis
            </a>
          </div>

          <div className="flex flex-wrap gap-6 mt-8 text-xs text-slate-500">
            <span>✓ Pago único o suscripción</span>
            <span>✓ Agente IA incluido</span>
            <span>✓ Compatible con Excel</span>
            <span>✓ Soporte WhatsApp</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ============================================
// CHAT WIDGET EMBEBIBLE
// ============================================
// Para agregar el chatbot de ventas en tu landing de AnalitIA:
//
// import { CFOChatEmbed } from "@/components/CFOBanner";
// <CFOChatEmbed />

export function CFOChatEmbed() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        width: "60px",
        height: "60px",
      }}
    >
      <a
        href={`${CFO_URL}/asesor`}
        target="_blank"
        rel="noopener"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#0d6de1",
          boxShadow: "0 4px 24px rgba(13,109,225,0.35)",
          color: "white",
          textDecoration: "none",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
        </svg>
      </a>
      <span
        style={{
          position: "absolute",
          top: "-2px",
          right: "-2px",
          width: "14px",
          height: "14px",
          background: "#22d3ee",
          borderRadius: "50%",
          animation: "pulse 2s infinite",
        }}
      />
    </div>
  );
}
