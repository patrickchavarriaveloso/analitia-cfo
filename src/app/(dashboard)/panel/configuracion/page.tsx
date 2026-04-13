"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Building2, Phone, CreditCard, Save, Loader2, Check, ShieldCheck, Bell, Key } from "lucide-react";
import { useUser, useSubscriptions } from "@/hooks/useSupabase";
import { formatCLP, cn } from "@/lib/utils";

export default function ConfiguracionPage() {
  const { user, loading: userLoading, updateProfile } = useUser();
  const { subscriptions, loading: subsLoading } = useSubscriptions();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    company_name: "",
    phone: "",
    rut: "",
    industry: "",
  });
  const [initialized, setInitialized] = useState(false);

  // Initialize form when user loads
  if (user && !initialized) {
    setForm({
      full_name: user.full_name || "",
      company_name: user.company_name || "",
      phone: user.phone || "",
      rut: user.rut || "",
      industry: user.industry || "",
    });
    setInitialized(true);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await updateProfile(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Configuración</h1>
        <p className="text-sm text-slate-500 mt-1">Gestiona tu perfil y suscripciones</p>
      </div>

      {/* Profile */}
      <div className="rounded-2xl bg-surface-800/60 border border-white/[0.06] p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-brand-400" />
          <h2 className="text-sm font-bold text-white">Perfil</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "full_name", label: "Nombre completo", icon: User, placeholder: "Juan Pérez" },
            { key: "company_name", label: "Empresa", icon: Building2, placeholder: "Mi Empresa SpA" },
            { key: "phone", label: "Teléfono", icon: Phone, placeholder: "+56 9 1234 5678" },
            { key: "rut", label: "RUT Empresa", icon: ShieldCheck, placeholder: "76.123.456-7" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs text-slate-500 mb-1.5 block">{f.label}</label>
              <input
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-surface-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-brand-500/40 border border-white/[0.06]"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">Industria</label>
          <select
            value={form.industry}
            onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}
            className="w-full bg-surface-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-brand-500/40 border border-white/[0.06]"
          >
            <option value="">Seleccionar...</option>
            {["Tecnología", "Retail", "Servicios profesionales", "Construcción", "Salud", "Agrícola", "Transporte", "Educación", "Otro"].map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Guardado" : "Guardar Cambios"}
          </button>
          <p className="text-xs text-slate-600">Email: {user?.email}</p>
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="rounded-2xl bg-surface-800/60 border border-white/[0.06] p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">Mis Suscripciones</h2>
        </div>

        {subsLoading ? (
          <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500 mb-3">No tienes productos activos</p>
            <a
              href="/tienda"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl inline-block"
            >
              Explorar Soluciones
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface-700/40 border border-white/[0.04]">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold",
                  sub.plan_type === "monthly" ? "bg-cyan-500/15 text-cyan-400" : "bg-brand-600/15 text-brand-400"
                )}>
                  {sub.plan_type === "monthly" ? "S" : "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {sub.product?.name || "Producto"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {sub.plan_type === "monthly" ? "Suscripción mensual · Gestión incluida" : "Licencia permanente"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatCLP(sub.amount)}</p>
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    sub.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {sub.status === "active" ? "Activa" : sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security */}
      <div className="rounded-2xl bg-surface-800/60 border border-white/[0.06] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-warning" />
          <h2 className="text-sm font-bold text-white">Seguridad</h2>
        </div>
        <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm rounded-xl border border-white/[0.06] transition-colors">
          Cambiar Contraseña
        </button>
      </div>
    </div>
  );
}
