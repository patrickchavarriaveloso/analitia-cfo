"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, ArrowUpRight,
  ArrowDownRight, Wallet, CreditCard, PiggyBank,
  Plus, Download, Upload, FileSpreadsheet,
} from "lucide-react";
import { formatCLP, cn } from "@/lib/utils";
import { RevenueChart, CashFlowChart, ExpenseDonut, ChartLegend } from "@/components/dashboard/Charts";

// Demo data — se reemplaza por datos de Supabase en producción
const DEMO_KPIS = [
  { label: "Ingresos del Mes", value: 8450000, change: 12.3, icon: DollarSign, color: "text-success" },
  { label: "Gastos del Mes", value: 5230000, change: -3.2, icon: Wallet, color: "text-warning" },
  { label: "Flujo Neto", value: 3220000, change: 24.1, icon: TrendingUp, color: "text-cyan-400" },
  { label: "Cuentas por Cobrar", value: 1800000, change: -8.5, icon: CreditCard, color: "text-brand-400" },
];

const REVENUE_DATA = [
  { month: "Nov", ingresos: 5200000, gastos: 3800000 },
  { month: "Dic", ingresos: 6100000, gastos: 4200000 },
  { month: "Ene", ingresos: 4800000, gastos: 3500000 },
  { month: "Feb", ingresos: 7200000, gastos: 4800000 },
  { month: "Mar", ingresos: 6500000, gastos: 4100000 },
  { month: "Abr", ingresos: 8450000, gastos: 5230000 },
];

const CASHFLOW_DATA = [
  { month: "Nov", flujo: 1400000 },
  { month: "Dic", flujo: 1900000 },
  { month: "Ene", flujo: 1300000 },
  { month: "Feb", flujo: 2400000 },
  { month: "Mar", flujo: 2400000 },
  { month: "Abr", flujo: 3220000 },
];

const EXPENSE_DATA = [
  { name: "Sueldos", value: 3200000 },
  { name: "Arriendo", value: 450000 },
  { name: "Tecnología", value: 520000 },
  { name: "Marketing", value: 380000 },
  { name: "Servicios", value: 280000 },
  { name: "Otros", value: 400000 },
];

const RECENT_ENTRIES = [
  { desc: "Venta servicios consultoría", type: "income", amount: 1200000, date: "2026-04-10", category: "Servicios" },
  { desc: "Arriendo oficina", type: "expense", amount: 450000, date: "2026-04-05", category: "Arriendo" },
  { desc: "Pago proveedor hosting", type: "expense", amount: 89000, date: "2026-04-03", category: "Tecnología" },
  { desc: "Factura cliente ABC SpA", type: "income", amount: 2300000, date: "2026-04-01", category: "Servicios" },
  { desc: "Remuneraciones abril", type: "expense", amount: 3200000, date: "2026-04-01", category: "Sueldos" },
];

export default function PanelPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dashboard Financiero</h1>
          <p className="text-sm text-slate-500 mt-1">
            Resumen de abril 2026 · Datos en tiempo real
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-700 hover:bg-surface-600 rounded-xl text-sm text-slate-300 border border-white/[0.06] transition-colors">
            <Upload className="w-4 h-4" /> Cargar Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-700 hover:bg-surface-600 rounded-xl text-sm text-slate-300 border border-white/[0.06] transition-colors">
            <Download className="w-4 h-4" /> Exportar
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-sm text-white font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Nuevo Registro
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-surface-800/60 border border-white/[0.06] card-glow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", `${kpi.color} bg-current/10`)}>
                <kpi.icon className={cn("w-5 h-5", kpi.color)} />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                  kpi.change > 0
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                )}
              >
                {kpi.change > 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(kpi.change)}%
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white">{formatCLP(kpi.value)}</p>
            <p className="text-xs text-slate-500 mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <h3 className="text-sm font-bold text-white mb-2">Ingresos vs Gastos (Últimos 6 meses)</h3>
          <RevenueChart data={REVENUE_DATA} />
          <ChartLegend items={[
            { color: "#0d6de1", label: "Ingresos" },
            { color: "#f59e0b", label: "Gastos" },
          ]} />
        </div>

        {/* Expense Breakdown */}
        <div className="p-6 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <h3 className="text-sm font-bold text-white mb-2">Gastos por Categoría</h3>
          <ExpenseDonut data={EXPENSE_DATA} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
            {EXPENSE_DATA.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: ["#0d6de1","#06b6d4","#10b981","#f59e0b","#ef4444","#8b5cf6"][i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <h3 className="text-sm font-bold text-white mb-2">Flujo de Caja Neto Mensual</h3>
          <CashFlowChart data={CASHFLOW_DATA} />
        </div>

        {/* Cash position */}
        <div className="p-6 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <h3 className="text-sm font-bold text-white mb-4">Posición de Caja</h3>
          <div className="text-center py-8">
            <PiggyBank className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-60" />
            <p className="text-3xl font-extrabold text-white">{formatCLP(12500000)}</p>
            <p className="text-xs text-slate-500 mt-1">Saldo disponible</p>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Banco Estado</span>
              <span className="text-white font-semibold">{formatCLP(8200000)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Banco Chile</span>
              <span className="text-white font-semibold">{formatCLP(4300000)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl bg-surface-800/60 border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="text-sm font-bold text-white">Últimos Movimientos</h3>
          <button className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
            Ver todos →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-white/[0.04]">
                <th className="text-left text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Descripción</th>
                <th className="text-left text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Categoría</th>
                <th className="text-left text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Fecha</th>
                <th className="text-right text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Monto</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ENTRIES.map((entry, i) => (
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3.5 text-sm text-white">{entry.desc}</td>
                  <td className="px-6 py-3.5">
                    <span className="text-xs px-2 py-1 rounded-full bg-surface-700 text-slate-400">
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{entry.date}</td>
                  <td className={cn(
                    "px-6 py-3.5 text-sm font-semibold text-right",
                    entry.type === "income" ? "text-success" : "text-danger"
                  )}>
                    {entry.type === "income" ? "+" : "-"}{formatCLP(entry.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excel Integration Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600/10 to-cyan-500/10 border border-brand-500/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <FileSpreadsheet className="w-12 h-12 text-brand-400 shrink-0" />
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-white">¿Prefieres trabajar con Excel?</h3>
            <p className="text-sm text-slate-400 mt-1">
              Descarga la plantilla, complétala offline y súbela cuando quieras.
              El sistema sincroniza automáticamente tus datos.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl border border-white/10 transition-colors">
              Descargar Plantilla
            </button>
            <button className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-colors">
              Subir Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
