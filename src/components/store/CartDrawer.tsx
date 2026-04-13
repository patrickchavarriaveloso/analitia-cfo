"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { formatCLP } from "@/lib/utils";
import type { CartItem } from "@/types";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (index: number) => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, onClose, items, onRemove, onCheckout }: CartDrawerProps) {
  const total = items.reduce(
    (sum, item) =>
      sum + (item.planType === "once" ? item.product.price_once : item.product.price_monthly),
    0
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-surface-800 border-l border-white/[0.06] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brand-400" />
                <h2 className="text-lg font-bold text-white">Tu Carrito</h2>
                <span className="px-2 py-0.5 bg-brand-600/20 text-brand-300 text-xs font-bold rounded-full">
                  {items.length}
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">Tu carrito está vacío</p>
                </div>
              ) : (
                items.map((item, i) => (
                  <div
                    key={`${item.product.slug}-${item.planType}-${i}`}
                    className="flex items-start gap-4 p-4 rounded-xl bg-surface-700/50 border border-white/[0.04]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.planType === "monthly" ? (
                          <span className="text-cyan-400">Suscripción mensual · Gestión incluida</span>
                        ) : (
                          "Pago único · Self-service"
                        )}
                      </p>
                      <p className="text-lg font-bold text-white mt-2">
                        {formatCLP(
                          item.planType === "once"
                            ? item.product.price_once
                            : item.product.price_monthly
                        )}
                        {item.planType === "monthly" && (
                          <span className="text-xs text-slate-500 font-normal">/mes</span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(i)}
                      className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-danger transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total</span>
                  <span className="text-2xl font-extrabold text-white">{formatCLP(total)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/20 transition-colors"
                >
                  Proceder al Pago
                </button>
                <p className="text-[11px] text-slate-500 text-center">
                  Pago seguro con Mercado Pago · SSL encriptado
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
