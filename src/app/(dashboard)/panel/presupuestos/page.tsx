"use client";

import { Plus, FileText, Clock, CheckCircle, XCircle, Send } from "lucide-react";
import { formatCLP, cn } from "@/lib/utils";

const QUOTES = [
  { id: "P-001", client: "ABC SpA", items: 5, total: 3500000, status: "approved", date: "2026-04-10" },
  { id: "P-002", client: "XYZ Ltda", items: 3, total: 1200000, status: "pending", date: "2026-04-08" },
  { id: "P-003", client: "Tech Corp", items: 8, total: 5800000, status: "sent", date: "2026-04-05" },
  { id: "P-004", client: "Retail SA", items: 2, total: 890000, status: "rejected", date: "2026-04-01" },
];

const ST: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  approved: { label: "Aprobado", cls: "text-success bg-success/10", Icon: CheckCircle },
  pending: { label: "Pendiente", cls: "text-warning bg-warning/10", Icon: Clock },
  sent: { label: "Enviado", cls: "text-brand-400 bg-brand-500/10", Icon: Send },
  rejected: { label: "Rechazado", cls: "text-danger bg-danger/10", Icon: XCircle },
};

export default function PresupuestosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Presupuestos</h1>
          <p className="text-sm text-slate-500 mt-1">Cotizaciones profesionales con seguimiento</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-sm text-white font-semibold">
          <Plus className="w-4 h-4" /> Nuevo Presupuesto
        </button>
      </div>

      <div className="rounded-2xl bg-surface-800/60 border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["N°", "Cliente", "Items", "Fecha", "Estado", "Total"].map((h) => (
                <th key={h} className={cn("text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3", h === "Total" ? "text-right" : "text-left")}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {QUOTES.map((q) => {
              const s = ST[q.status];
              return (
                <tr key={q.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer">
                  <td className="px-6 py-3.5 text-sm text-cyan-400 font-mono">{q.id}</td>
                  <td className="px-6 py-3.5 text-sm text-white">{q.client}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-400">{q.items}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{q.date}</td>
                  <td className="px-6 py-3.5">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full", s.cls)}>
                      <s.Icon className="w-3 h-3" /> {s.label}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-white text-right">{formatCLP(q.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
