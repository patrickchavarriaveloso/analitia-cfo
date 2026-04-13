"use client";

import { TrendingUp, TrendingDown, Users, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { formatCLP, cn } from "@/lib/utils";

const METRICS = [
  { label: "MRR", value: 4850000, change: 8.2, icon: DollarSign },
  { label: "ARR", value: 58200000, change: 8.2, icon: TrendingUp },
  { label: "Clientes Activos", value: 127, change: 5.1, icon: Users, isCurrency: false },
  { label: "Churn Rate", value: 3.2, change: -0.8, icon: RefreshCw, isCurrency: false, isPercent: true },
];

const COHORTS = [
  { month: "Ene 2026", acquired: 18, retained: 16, revenue: 480000 },
  { month: "Feb 2026", acquired: 22, retained: 20, revenue: 600000 },
  { month: "Mar 2026", acquired: 15, retained: 14, revenue: 420000 },
  { month: "Abr 2026", acquired: 25, retained: 25, revenue: 750000 },
];

export default function SaaSPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Métricas SaaS</h1>
        <p className="text-sm text-slate-500 mt-1">MRR, ARR, Churn, LTV y unit economics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <div key={m.label} className="p-5 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <m.icon className="w-5 h-5 text-brand-400" />
              <span className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full", m.change > 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                {m.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(m.change)}%
              </span>
            </div>
            <p className="text-2xl font-extrabold text-white">
              {m.isPercent ? `${m.value}%` : m.isCurrency === false ? m.value : formatCLP(m.value)}
            </p>
            <p className="text-xs text-slate-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unit Economics */}
        <div className="p-6 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <h3 className="text-sm font-bold text-white mb-4">Unit Economics</h3>
          <div className="space-y-4">
            {[
              { label: "LTV (Lifetime Value)", value: formatCLP(1250000) },
              { label: "CAC (Costo Adquisición)", value: formatCLP(180000) },
              { label: "LTV/CAC Ratio", value: "6.9x" },
              { label: "Payback Period", value: "2.8 meses" },
              { label: "ARPU", value: formatCLP(38190) },
              { label: "NRR (Net Revenue Retention)", value: "108%" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                <span className="text-sm text-slate-400">{item.label}</span>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Table */}
        <div className="p-6 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <h3 className="text-sm font-bold text-white mb-4">Análisis de Cohortes</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Cohorte", "Adquiridos", "Retenidos", "Revenue"].map((h) => (
                  <th key={h} className="text-left text-[11px] text-slate-500 font-medium uppercase px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COHORTS.map((c) => (
                <tr key={c.month} className="border-b border-white/[0.03]">
                  <td className="px-3 py-2.5 text-sm text-white">{c.month}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-400">{c.acquired}</td>
                  <td className="px-3 py-2.5 text-sm text-success">{c.retained} ({Math.round(c.retained/c.acquired*100)}%)</td>
                  <td className="px-3 py-2.5 text-sm text-white font-medium">{formatCLP(c.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
