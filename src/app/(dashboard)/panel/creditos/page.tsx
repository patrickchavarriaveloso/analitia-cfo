"use client";

import { Plus, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { formatCLP, cn } from "@/lib/utils";

const EVALUATIONS = [
  { client: "Distribuidora Norte SpA", rut: "76.543.210-1", score: 85, risk: "low", amount: 12000000, date: "2026-04-10" },
  { client: "Comercial Sur Ltda", rut: "77.654.321-2", score: 62, risk: "medium", amount: 5000000, date: "2026-04-08" },
  { client: "Importadora Este SA", rut: "78.765.432-3", score: 38, risk: "high", amount: 8000000, date: "2026-04-05" },
  { client: "Servicios Oeste SpA", rut: "79.876.543-4", score: 91, risk: "low", amount: 3500000, date: "2026-04-03" },
];

const RISK: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  low: { label: "Bajo", cls: "text-success bg-success/10", Icon: CheckCircle },
  medium: { label: "Medio", cls: "text-warning bg-warning/10", Icon: AlertTriangle },
  high: { label: "Alto", cls: "text-danger bg-danger/10", Icon: XCircle },
};

export default function CreditosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Evaluación de Créditos</h1>
          <p className="text-sm text-slate-500 mt-1">Scoring crediticio y análisis de riesgo</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-sm text-white font-semibold">
          <Plus className="w-4 h-4" /> Nueva Evaluación
        </button>
      </div>

      <div className="rounded-2xl bg-surface-800/60 border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Cliente", "RUT", "Score", "Riesgo", "Monto Solicitado", "Fecha"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EVALUATIONS.map((e) => {
              const r = RISK[e.risk];
              return (
                <tr key={e.rut} className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer">
                  <td className="px-6 py-3.5 text-sm text-white font-medium">{e.client}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-400 font-mono">{e.rut}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-surface-700 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", e.score >= 70 ? "bg-success" : e.score >= 50 ? "bg-warning" : "bg-danger")} style={{ width: `${e.score}%` }} />
                      </div>
                      <span className="text-sm font-bold text-white">{e.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full", r.cls)}>
                      <r.Icon className="w-3 h-3" /> {r.label}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-white">{formatCLP(e.amount)}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{e.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
