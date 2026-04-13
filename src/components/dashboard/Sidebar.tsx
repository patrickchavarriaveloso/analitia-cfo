"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, TrendingUp, BookOpen, CreditCard,
  Cloud, ShoppingCart, FileText, Users, Menu, X,
  LogOut, MessageCircle, ShieldCheck, BarChart3, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/panel", label: "Dashboard", icon: LayoutDashboard },
  { href: "/panel/flujo-caja", label: "Flujo de Caja", icon: TrendingUp },
  { href: "/panel/contabilidad", label: "Contabilidad", icon: ShieldCheck },
  { href: "/panel/presupuestos", label: "Presupuestos", icon: FileText },
  { href: "/panel/creditos", label: "Evaluación Créditos", icon: CreditCard },
  { href: "/panel/ordenes", label: "Órdenes de Compra", icon: ShoppingCart },
  { href: "/panel/saas", label: "Métricas SaaS", icon: Cloud },
  { href: "/panel/guia", label: "Guía Financiera", icon: BookOpen },
  { href: "/panel/sesiones", label: "Sesiones 1:1", icon: Users },
  { href: "/panel/configuracion", label: "Configuración", icon: Settings },
];

interface SidebarProps {
  userName?: string;
  onSignOut?: () => void;
}

export function Sidebar({ userName = "Usuario", onSignOut }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-xl"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-surface-800 border-r border-white/[0.06] flex flex-col transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <Link href="/panel" className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold text-white">
              Analit<span className="text-brand-500">IA</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest uppercase text-cyan-400">CFO</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-brand-600/15 text-brand-300"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-4.5 h-4.5", active ? "text-brand-400" : "")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.06] space-y-1">
          <Link
            href="/panel/chat"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          >
            <MessageCircle className="w-4.5 h-4.5" />
            Asesor IA
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center text-xs font-bold text-brand-300">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
            </div>
            <button
              onClick={async () => {
                const { createClient } = await import("@/lib/supabase-browser");
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
