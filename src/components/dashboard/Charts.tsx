"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from "recharts";

const COLORS = {
  brand: "#0d6de1",
  cyan: "#06b6d4",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  slate: "#64748b",
  surface: "#1e2a45",
};

const tooltipStyle = {
  contentStyle: {
    background: "#0f1729",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    fontSize: "12px",
    color: "#e2e8f0",
    padding: "10px 14px",
  },
  labelStyle: { color: "#94a3b8", fontWeight: 600, marginBottom: 4 },
};

function fmtCLP(v: number) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}

// ─── Revenue vs Expenses Area Chart ───
interface RevenueData {
  month: string;
  ingresos: number;
  gastos: number;
}

export function RevenueChart({ data }: { data: RevenueData[] }) {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.brand} stopOpacity={0.3} />
              <stop offset="100%" stopColor={COLORS.brand} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.warning} stopOpacity={0.2} />
              <stop offset="100%" stopColor={COLORS.warning} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={fmtCLP} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => fmtCLP(v)} />
          <Area type="monotone" dataKey="ingresos" stroke={COLORS.brand} fill="url(#gInc)" strokeWidth={2} name="Ingresos" />
          <Area type="monotone" dataKey="gastos" stroke={COLORS.warning} fill="url(#gExp)" strokeWidth={2} name="Gastos" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Cash Flow Bar Chart ───
interface CashFlowData {
  month: string;
  flujo: number;
}

export function CashFlowChart({ data }: { data: CashFlowData[] }) {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={fmtCLP} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => fmtCLP(v)} />
          <Bar dataKey="flujo" name="Flujo neto" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.flujo >= 0 ? COLORS.cyan : COLORS.danger} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Expense Breakdown Donut ───
interface ExpenseCategory {
  name: string;
  value: number;
}

const PIE_COLORS = ["#0d6de1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#64748b"];

export function ExpenseDonut({ data }: { data: ExpenseCategory[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="w-full h-[280px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            {...tooltipStyle}
            formatter={(v: number) => [fmtCLP(v), ""]}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-lg font-extrabold text-white">{fmtCLP(total)}</p>
          <p className="text-[10px] text-slate-500">Total gastos</p>
        </div>
      </div>
    </div>
  );
}

// ─── MRR Growth Line Chart ───
interface MRRData {
  month: string;
  mrr: number;
  target?: number;
}

export function MRRChart({ data }: { data: MRRData[] }) {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={fmtCLP} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => fmtCLP(v)} />
          <Line type="monotone" dataKey="mrr" stroke={COLORS.cyan} strokeWidth={2.5} dot={{ fill: COLORS.cyan, r: 4 }} name="MRR" />
          {data[0]?.target !== undefined && (
            <Line type="monotone" dataKey="target" stroke={COLORS.slate} strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Target" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Legend component ───
export function ChartLegend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex items-center gap-5 mt-3 text-xs text-slate-500">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: item.color }} />
          {item.label}
        </div>
      ))}
    </div>
  );
}
