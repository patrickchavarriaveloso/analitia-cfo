"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export default function RegistroPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.name,
            company_name: form.company,
          },
        },
      });
      if (authError) throw authError;
      router.push("/panel");
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { key: "name", label: "Nombre completo", type: "text", placeholder: "Juan Pérez" },
    { key: "email", label: "Email", type: "email", placeholder: "juan@empresa.cl" },
    { key: "company", label: "Empresa (opcional)", type: "text", placeholder: "Mi Empresa SpA" },
    { key: "password", label: "Contraseña", type: "password", placeholder: "Mínimo 6 caracteres" },
  ];

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-cyan-500/6 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/tienda" className="inline-block">
            <span className="text-2xl font-extrabold text-white">
              Analit<span className="text-brand-500">IA</span>
              <span className="text-cyan-400 text-sm ml-1">CFO</span>
            </span>
          </Link>
          <p className="text-slate-500 text-sm mt-2">Crea tu cuenta en 30 segundos</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => update(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  required={f.key !== "company"}
                  className="w-full bg-surface-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-brand-500/40 border border-white/[0.06]"
                />
              </div>
            ))}

            {error && (
              <p className="text-sm text-danger bg-danger/10 px-4 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Crear Cuenta
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold">
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
