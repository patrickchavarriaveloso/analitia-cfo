"use client";

import { Calendar, Clock, Video, CheckCircle, Plus, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const SESSIONS = [
  { id: 1, date: "2026-04-15", time: "10:00", duration: 60, topic: "Análisis de flujo de caja Q1", status: "scheduled", advisor: "Ing. Patricio López" },
  { id: 2, date: "2026-04-08", time: "15:00", duration: 60, topic: "Estrategia tributaria 2026", status: "completed", advisor: "Ing. Patricio López" },
  { id: 3, date: "2026-03-25", time: "11:00", duration: 60, topic: "Revisión estados financieros", status: "completed", advisor: "Ing. Patricio López" },
];

export default function SesionesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Sesiones Estratégicas 1:1</h1>
          <p className="text-sm text-slate-500 mt-1">Consultoría personalizada con ingenieros en finanzas</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-sm text-white font-semibold">
          <Plus className="w-4 h-4" /> Agendar Sesión
        </button>
      </div>

      {/* Next session highlight */}
      {SESSIONS.filter(s => s.status === "scheduled").map((s) => (
        <div key={s.id} className="p-6 rounded-2xl bg-gradient-to-r from-brand-600/10 to-cyan-500/10 border border-brand-500/20">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-600/20 flex items-center justify-center">
              <Video className="w-8 h-8 text-brand-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">Próxima sesión</p>
              <p className="text-lg font-bold text-white">{s.topic}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {s.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {s.time} hrs · {s.duration} min</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Con {s.advisor}</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 rounded-xl text-sm text-white font-semibold">
              <Video className="w-4 h-4" /> Unirse
            </button>
          </div>
        </div>
      ))}

      {/* Past sessions */}
      <div>
        <h3 className="text-sm font-bold text-white mb-4">Historial de Sesiones</h3>
        <div className="space-y-3">
          {SESSIONS.filter(s => s.status === "completed").map((s) => (
            <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/60 border border-white/[0.06]">
              <CheckCircle className="w-5 h-5 text-success shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{s.topic}</p>
                <p className="text-xs text-slate-500">{s.date} · {s.time} · {s.advisor}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-slate-300">
                  Ver grabación
                </button>
                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-slate-300">
                  Notas
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
