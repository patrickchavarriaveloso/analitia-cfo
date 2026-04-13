"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, TrendingUp, BarChart3, BookOpen, Users,
  CreditCard, Cloud, ShoppingCart, FileText, Check, Zap,
} from "lucide-react";
import { formatCLP, cn } from "@/lib/utils";
import type { Product, CartItem } from "@/types";

const ICONS: Record<string, React.ElementType> = {
  "shield-check": ShieldCheck,
  "trending-up": TrendingUp,
  "bar-chart-3": BarChart3,
  "book-open": BookOpen,
  users: Users,
  "credit-card": CreditCard,
  cloud: Cloud,
  "shopping-cart": ShoppingCart,
  "file-text": FileText,
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
  index: number;
}

export function ProductCard({ product, onAddToCart, index }: ProductCardProps) {
  const [plan, setPlan] = useState<"once" | "monthly">("monthly");
  const Icon = ICONS[product.icon] || Zap;
  const price = plan === "once" ? product.price_once : product.price_monthly;
  const discount = Math.round(((product.price_once - product.price_monthly) / product.price_once) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative rounded-2xl border border-white/[0.06] bg-surface-800/60 backdrop-blur-sm overflow-hidden card-glow flex flex-col"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand-600/15 flex items-center justify-center">
            <Icon className="w-6 h-6 text-brand-400" />
          </div>
          {plan === "monthly" && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-400 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-cyan-300 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Plan Toggle */}
      <div className="px-6 mb-4">
        <div className="flex bg-surface-900/80 rounded-xl p-1">
          <button
            onClick={() => setPlan("once")}
            className={cn(
              "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
              plan === "once"
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            Pago Único
          </button>
          <button
            onClick={() => setPlan("monthly")}
            className={cn(
              "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
              plan === "monthly"
                ? "bg-brand-600/30 text-brand-300 shadow-sm"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            Suscripción
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="px-6 mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white">{formatCLP(price)}</span>
          {plan === "monthly" && (
            <span className="text-sm text-slate-500">/mes</span>
          )}
        </div>
        {plan === "monthly" && (
          <p className="text-xs text-cyan-400/70 mt-1">
            Incluye gestión operativa por nuestro equipo + IA
          </p>
        )}
        {plan === "once" && (
          <p className="text-xs text-slate-500 mt-1">
            Licencia permanente · Self-service
          </p>
        )}
      </div>

      {/* Features */}
      <div className="px-6 mb-6 flex-1">
        <ul className="space-y-2">
          {product.features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
              <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
          {product.features.length > 4 && (
            <li className="text-xs text-slate-500 pl-6">
              +{product.features.length - 4} más
            </li>
          )}
        </ul>
      </div>

      {/* CTA */}
      <div className="p-6 pt-0">
        <button
          onClick={() => onAddToCart({ product, planType: plan })}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-bold transition-all",
            plan === "monthly"
              ? "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20"
              : "bg-white/10 hover:bg-white/15 text-white"
          )}
        >
          {plan === "monthly" ? "Suscribirme" : "Comprar Ahora"}
        </button>
      </div>
    </motion.div>
  );
}
