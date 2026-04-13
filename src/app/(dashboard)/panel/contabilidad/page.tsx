"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FileText, BarChart3, Download, Calculator } from "lucide-react";
import { formatCLP } from "@/lib/utils";

const ACCOUNTS = [
  { code: "1.1.01", name: "Caja", debit: 2500000, credit: 0 },
  { code: "1.1.02", name: "Banco Estado", debit: 8200000, credit: 0 },
  { code: "1.1.03", name: "Banco Chile", debit: 4300000, credit: 0 },
  { code: "1.2.01", name: "Cuentas por Cobrar", debit: 1800000, credit: 0 },
  { code: "2.1.01", name: "Cuentas por Pagar", debit: 0, credit: 3200000 },
  { code: "2.1.02", name: "IVA Débito Fiscal", debit: 0, credit: 890000 },
  { code: "3.1.01", name: "Capital", debit: 0, credit: 10000000 },
  { code: "4.1.01", name: "Ingresos por Servicios", debit: 0, credit: 8450000 },
  { code: "5.1.01", name: "Gasto Remuneraciones", debit: 3200000, credit: 0 },
  { code: "5.1.02", name: "Gasto Arriendo", debit: 450000, credit: 0 },
  { code: "5.1.03", name: "Gasto Tecnología", debit: 120000, credit: 0 },
];

export default function ContabilidadPage() {
  const totalDebit = ACCOUNTS.reduce((s, a) => s + a.debit, 0);
  const totalCredit = ACCOUNTS.reduce((s, a) => s + a.credit, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Control Contable</h1>
          <p className="text-sm text-slate-500 mt-1">Balance general y plan de cuentas</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-700 hover:bg-surface-600 rounded-xl text-sm text-slate-300 border border-white/[0.06]">
            <Download className="w-4 h-4" /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-brand-400" />
            <span className="text-xs text-slate-500">Total Activos</span>
          </div>
          <p className="text-2xl font-extrabold text-white">{formatCLP(16800000)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-warning" />
            <span className="text-xs text-slate-500">Total Pasivos</span>
          </div>
          <p className="text-2xl font-extrabold text-warning">{formatCLP(4090000)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-xs text-slate-500">Patrimonio</span>
          </div>
          <p className="text-2xl font-extrabold text-success">{formatCLP(12710000)}</p>
        </div>
      </div>

      {/* Chart of Accounts */}
      <div className="rounded-2xl bg-surface-800/60 border border-white/[0.06] overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="text-sm font-bold text-white">Plan de Cuentas — Balance de Comprobación</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-white/[0.06]">
                <th className="text-left text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Código</th>
                <th className="text-left text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Cuenta</th>
                <th className="text-right text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Debe</th>
                <th className="text-right text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3">Haber</th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS.map((acc) => (
                <tr key={acc.code} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-6 py-3 text-sm text-cyan-400 font-mono">{acc.code}</td>
                  <td className="px-6 py-3 text-sm text-white">{acc.name}</td>
                  <td className="px-6 py-3 text-sm text-right text-slate-300">
                    {acc.debit > 0 ? formatCLP(acc.debit) : "—"}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-slate-300">
                    {acc.credit > 0 ? formatCLP(acc.credit) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/[0.1] bg-surface-700/30">
                <td colSpan={2} className="px-6 py-3 text-sm font-bold text-white">TOTALES</td>
                <td className="px-6 py-3 text-sm font-bold text-right text-white">{formatCLP(totalDebit)}</td>
                <td className="px-6 py-3 text-sm font-bold text-right text-white">{formatCLP(totalCredit)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        {totalDebit === totalCredit && (
          <div className="px-6 py-3 bg-success/5 border-t border-success/20">
            <p className="text-xs text-success font-semibold">✓ Balance cuadrado — Debe = Haber</p>
          </div>
        )}
      </div>
    </div>
  );
}
