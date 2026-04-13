"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Trash2, TrendingUp, TrendingDown, DollarSign,
  Calendar, Filter, Download, Upload, Loader2,
} from "lucide-react";
import { formatCLP, cn } from "@/lib/utils";
import { useFinancialEntries } from "@/hooks/useSupabase";
import { ExcelManager } from "@/components/dashboard/ExcelManager";

const CATEGORIES_IN = ["Ventas", "Servicios", "Intereses", "Otros ingresos"];
const CATEGORIES_EX = ["Sueldos", "Arriendo", "Servicios básicos", "Tecnología", "Marketing", "Otros gastos"];

export default function FlujoCajaPage() {
  const { entries, loading, addEntry, deleteEntry, bulkInsert, kpis } =
    useFinancialEntries("flujo-caja-premium");
  const [showForm, setShowForm] = useState(false);
  const [showExcel, setShowExcel] = useState(false);
  const [newEntry, setNewEntry] = useState({
    entry_type: "income" as "income" | "expense",
    category: "",
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
  });
  const [saving, setSaving] = useState(false);

  const totalIn = kpis.totalIncome;
  const totalEx = kpis.totalExpense;
  const netFlow = kpis.netFlow;

  async function handleAdd() {
    if (!newEntry.description || !newEntry.amount || !newEntry.category) return;
    setSaving(true);
    await addEntry({
      ...newEntry,
      product_slug: "flujo-caja-premium",
      currency: "CLP",
      amount: Number(newEntry.amount),
      metadata: {},
      subcategory: null,
    });
    setNewEntry({ entry_type: "income", category: "", description: "", amount: 0, date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await deleteEntry(id);
  }

  async function handleExcelImport(importedEntries: any[]) {
    await bulkInsert(importedEntries);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Flujo de Caja</h1>
          <p className="text-sm text-slate-500 mt-1">Control de ingresos y egresos en tiempo real</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExcel(!showExcel)}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-700 hover:bg-surface-600 rounded-xl text-sm text-slate-300 border border-white/[0.06]"
          >
            <Upload className="w-4 h-4" /> Excel
          </button>
          <a
            href="/api/excel?template=flujo-caja"
            download
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-700 hover:bg-surface-600 rounded-xl text-sm text-slate-300 border border-white/[0.06]"
          >
            <Download className="w-4 h-4" /> Plantilla
          </a>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-sm text-white font-semibold"
          >
            <Plus className="w-4 h-4" /> Nuevo Movimiento
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-slate-500">Total Ingresos</span>
          </div>
          <p className="text-2xl font-extrabold text-success">{formatCLP(totalIn)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-danger" />
            <span className="text-xs text-slate-500">Total Gastos</span>
          </div>
          <p className="text-2xl font-extrabold text-danger">{formatCLP(totalEx)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-500">Flujo Neto</span>
          </div>
          <p className={cn("text-2xl font-extrabold", netFlow >= 0 ? "text-cyan-400" : "text-danger")}>
            {formatCLP(netFlow)}
          </p>
        </div>
      </div>

      {/* Excel Manager */}
      {showExcel && (
        <ExcelManager template="flujo-caja" onImport={handleExcelImport} />
      )}

      {/* Add Entry Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-6 rounded-2xl bg-surface-800/80 border border-brand-500/20"
        >
          <h3 className="text-sm font-bold text-white mb-4">Nuevo Movimiento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Tipo</label>
              <select
                value={newEntry.entry_type}
                onChange={(e) => setNewEntry((p) => ({ ...p, entry_type: e.target.value as "income" | "expense", category: "" }))}
                className="w-full bg-surface-700 rounded-xl px-3 py-2.5 text-sm text-white border border-white/[0.06] outline-none"
              >
                <option value="income">Ingreso</option>
                <option value="expense">Gasto</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Categoría</label>
              <select
                value={newEntry.category}
                onChange={(e) => setNewEntry((p) => ({ ...p, category: e.target.value }))}
                className="w-full bg-surface-700 rounded-xl px-3 py-2.5 text-sm text-white border border-white/[0.06] outline-none"
              >
                <option value="">Seleccionar...</option>
                {(newEntry.entry_type === "income" ? CATEGORIES_IN : CATEGORIES_EX).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Descripción</label>
              <input
                value={newEntry.description}
                onChange={(e) => setNewEntry((p) => ({ ...p, description: e.target.value }))}
                placeholder="Detalle..."
                className="w-full bg-surface-700 rounded-xl px-3 py-2.5 text-sm text-white border border-white/[0.06] outline-none placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Monto (CLP)</label>
              <input
                type="number"
                value={newEntry.amount || ""}
                onChange={(e) => setNewEntry((p) => ({ ...p, amount: Number(e.target.value) }))}
                placeholder="0"
                className="w-full bg-surface-700 rounded-xl px-3 py-2.5 text-sm text-white border border-white/[0.06] outline-none placeholder:text-slate-600"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAdd}
                disabled={saving}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Agregar"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-500 mt-3">Cargando movimientos...</p>
        </div>
      )}

      {/* Entries Table */}
      {!loading && (
      <div className="rounded-2xl bg-surface-800/60 border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Tipo</th>
                <th className="text-left text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Descripción</th>
                <th className="text-left text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Categoría</th>
                <th className="text-left text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Fecha</th>
                <th className="text-right text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Monto</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                    Sin movimientos. Agrega uno o sube un Excel para comenzar.
                  </td>
                </tr>
              ) : entries.map((entry) => (
                <tr key={entry.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-6 py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full",
                      entry.entry_type === "income" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    )}>
                      {entry.entry_type === "income" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {entry.entry_type === "income" ? "Ingreso" : "Gasto"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-white">{entry.description}</td>
                  <td className="px-6 py-3 text-sm text-slate-400">{entry.category}</td>
                  <td className="px-6 py-3 text-sm text-slate-500">{entry.date}</td>
                  <td className={cn(
                    "px-6 py-3 text-sm font-semibold text-right",
                    entry.entry_type === "income" ? "text-success" : "text-danger"
                  )}>
                    {entry.entry_type === "income" ? "+" : "-"}{formatCLP(Number(entry.amount))}
                  </td>
                  <td className="px-6 py-3">
                    <button onClick={() => handleDelete(entry.id)} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-600 hover:text-danger">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}
