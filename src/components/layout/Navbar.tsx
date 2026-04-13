"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  cartCount?: number;
  onCartClick?: () => void;
  variant?: "store" | "dashboard" | "admin";
}

export function Navbar({ cartCount = 0, onCartClick, variant = "store" }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const storeLinks = [
    { href: "/tienda", label: "Soluciones" },
    { href: "https://analitia.cl", label: "AnalitIA", external: true },
    { href: "/login", label: "Mi Cuenta" },
  ];

  const links = variant === "store" ? storeLinks : storeLinks;

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/tienda" className="flex items-center gap-1.5 group">
          <span className="text-xl font-extrabold tracking-tight text-white">
            Analit<span className="text-brand-500">IA</span>
          </span>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-cyan-400 opacity-80 ml-1">
            CFO
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener" } : {})}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {variant === "store" && (
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 rounded-full text-[11px] font-bold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <Link
            href="/login"
            className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Acceder
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-slate-300"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass rounded-2xl mt-2 p-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-slate-300 hover:text-white py-2"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="block text-center px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl"
          >
            Acceder
          </Link>
        </div>
      )}
    </nav>
  );
}
