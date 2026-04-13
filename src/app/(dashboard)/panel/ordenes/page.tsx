"use client";
import { Plus, Package, Clock, CheckCircle, Truck } from "lucide-react";
import { formatCLP, cn } from "@/lib/utils";

const ORDERS = [
  { id: "OC-2026-001", supplier: "Proveedor A", items: 12, total: 2400000, status: "delivered", date: "2026-04-10" },
  { id: "OC-2026-002", supplier: "Proveedor B", items: 5, total: 890000, status: "transit", date: "2026-04-07" },
  { id: "OC-2026-003", supplier: "Proveedor C", items: 20, total: 5200000, status: "pending", date: "2026-04-05" },
  { id: "OC-2026-004", supplier: "Proveedor D", items: 3, total: 340000, status: "approved", date: "2026-04-02" },
];
const ST: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  delivered: { label: "Entregado", cls: "text-success bg-success/10", Icon: CheckCircle },
  transit: { label: "En tránsito", cls: "text-brand-400 bg-brand-500/10", Icon: Truck },
  pending: { label: "Pendiente", cls: "text-warning bg-warning/10", Icon: Clock },
  approved: { label: "Aprobada", cls: "text-cyan-400 bg-cyan-500/10", Icon: Package },
};

export default function OrdenesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Órdenes de Compra</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión y seguimiento de compras</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-sm text-white font-semibold">
          <Plus className="w-4 h-4" /> Nueva OC
        </button>
      </div>
      <div className="rounded-2xl bg-surface-800/60 border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/[0.06]">
            {["N°", "Proveedor", "Items", "Fecha", "Estado", "Total"].map((h) => (
              <th key={h} className={cn("text-[11px] text-slate-500 font-medium uppercase tracking-wider px-6 py-3", h === "Total" ? "text-right" : "text-left")}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{ORDERS.map((o) => { const s = ST[o.status]; return (
            <tr key={o.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
              <td className="px-6 py-3.5 text-sm text-cyan-400 font-mono">{o.id}</td>
              <td className="px-6 py-3.5 text-sm text-white">{o.supplier}</td>
              <td className="px-6 py-3.5 text-sm text-slate-400">{o.items}</td>
              <td className="px-6 py-3.5 text-sm text-slate-500">{o.date}</td>
              <td className="px-6 py-3.5"><span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full", s.cls)}><s.Icon className="w-3 h-3" /> {s.label}</span></td>
              <td className="px-6 py-3.5 text-sm font-semibold text-white text-right">{formatCLP(o.total)}</td>
            </tr>
          ); })}</tbody>
        </table>
      </div>
    </div>
  );
}
