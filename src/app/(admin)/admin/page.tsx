"use client";

import { motion } from "framer-motion";
import {
  Users, CreditCard, DollarSign, TrendingUp,
  ArrowUpRight, Activity, RefreshCw, Eye,
  MoreHorizontal, Search, Filter,
} from "lucide-react";
import { formatCLP, cn } from "@/lib/utils";

const STATS = [
  { label: "Usuarios Registrados", value: 142, change: 12, icon: Users, color: "text-brand-400" },
  { label: "Suscripciones Activas", value: 87, change: 8, icon: CreditCard, color: "text-cyan-400" },
  { label: "Revenue Mensual", value: 3250000, change: 15, icon: DollarSign, color: "text-success", isCurrency: true },
  { label: "Tasa de Retención", value: 94.2, change: 2.1, icon: RefreshCw, color: "text-warning", isPercent: true },
];

const CLIENTS = [
  { name: "María González", email: "maria@empresa.cl", company: "Tech SpA", products: 3, mrr: 85000, status: "active", joined: "2026-03-15" },
  { name: "Carlos Muñoz", email: "carlos@retail.cl", company: "Retail SA", products: 1, mrr: 27000, status: "active", joined: "2026-03-20" },
  { name: "Ana Fuentes", email: "ana@servicios.cl", company: "Servicios Ltda", products: 2, mrr: 54000, status: "active", joined: "2026-04-01" },
  { name: "Pedro Soto", email: "pedro@import.cl", company: "Import SpA", products: 1, mrr: 0, status: "once", joined: "2026-04-05" },
  { name: "Laura Díaz", email: "laura@agro.cl", company: "AgroCorp", products: 4, mrr: 120000, status: "active", joined: "2026-02-10" },
  { name: "Roberto Silva", email: "roberto@const.cl", company: "Constructora RS", products: 2, mrr: 0, status: "cancelled", joined: "2026-01-20" },
];

const RECENT_PAYMENTS = [
  { client: "María González", product: "Control Total", amount: 40491, type: "monthly", date: "2026-04-12" },
  { client: "Ana Fuentes", product: "Flujo de Caja 360°", amount: 26991, type: "monthly", date: "2026-04-11" },
  { client: "Pedro Soto", product: "Órdenes de Compra", amount: 19900, type: "once", date: "2026-04-10" },
  { client: "Laura Díaz", product: "Evaluación Créditos", amount: 35991, type: "monthly", date: "2026-04-10" },
  { client: "Carlos Muñoz", product: "Flujo de Caja Prof.", amount: 17991, type: "monthly", date: "2026-04-09" },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Panel de Administración</h1>
        <p className="text-sm text-slate-500 mt-1">Vista general del ecosistema AnalitIA CFO</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-surface-800/60 border border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-3">
              <s.icon className={cn("w-5 h-5", s.color)} />
              <span className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" /> +{s.change}%
              </span>
            </div>
            <p className="text-2xl font-extrabold text-white">
              {s.isCurrency ? formatCLP(s.value) : s.isPercent ? `${s.value}%` : s.value}
            </p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients Table */}
        <div id="clients" className="lg:col-span-2 rounded-2xl bg-surface-800/60 border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white">Clientes</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input placeholder="Buscar..." className="bg-surface-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white w-48 outline-none border border-white/[0.06] focus:ring-1 focus:ring-brand-500/40" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Cliente", "Empresa", "Productos", "MRR", "Estado"].map((h) => (
                    <th key={h} className="text-left text-[11px] text-slate-500 font-medium uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLIENTS.map((c) => (
                  <tr key={c.email} className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer">
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm text-white font-medium">{c.name}</p>
                        <p className="text-[11px] text-slate-500">{c.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-400">{c.company}</td>
                    <td className="px-5 py-3 text-sm text-white">{c.products}</td>
                    <td className="px-5 py-3 text-sm text-white font-medium">
                      {c.mrr > 0 ? formatCLP(c.mrr) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-full",
                        c.status === "active" ? "text-success bg-success/10" :
                        c.status === "once" ? "text-brand-400 bg-brand-500/10" :
                        "text-danger bg-danger/10"
                      )}>
                        {c.status === "active" ? "Suscrito" : c.status === "once" ? "Pago único" : "Cancelado"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <div className="p-5 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white">Últimos Pagos</h3>
          </div>
          <div className="p-4 space-y-3">
            {RECENT_PAYMENTS.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/30 hover:bg-surface-700/50 transition-colors">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                  p.type === "monthly" ? "bg-cyan-500/15 text-cyan-400" : "bg-brand-600/15 text-brand-400"
                )}>
                  {p.type === "monthly" ? "S" : "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{p.client}</p>
                  <p className="text-[11px] text-slate-500 truncate">{p.product}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-success">{formatCLP(p.amount)}</p>
                  <p className="text-[10px] text-slate-600">{p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
