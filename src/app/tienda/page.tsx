"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Shield, Zap, HeadphonesIcon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/store/ProductCard";
import { CartDrawer } from "@/components/store/CartDrawer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { PRODUCTS } from "@/lib/products";
import type { CartItem } from "@/types";

export default function TiendaPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  function addToCart(item: CartItem) {
    setCart((prev) => [...prev, item]);
    setCartOpen(true);
  }

  function removeFromCart(index: number) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCheckout() {
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (err) {
      console.error("Error al crear preferencia de pago:", err);
    }
  }

  return (
    <div className="min-h-screen bg-surface-900">
      <Navbar cartCount={cart.length} onCartClick={() => setCartOpen(true)} />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* BG Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-brand-600/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/6 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Plataforma de Inteligencia Financiera con IA
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              <span className="text-white">Tu CFO Virtual</span>
              <br />
              <span className="text-gradient">Impulsado por IA</span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Sistemas financieros inteligentes para PYMES chilenas.
              Contabilidad, flujo de caja, presupuestos y más — todo automatizado
              con inteligencia artificial.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#productos"
                className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2"
              >
                Ver Soluciones <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://analitia.cl"
                target="_blank"
                rel="noopener"
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all"
              >
                Conocer AnalitIA
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-10 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            Pago 100% seguro
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-warning" />
            Operativo en minutos
          </div>
          <div className="flex items-center gap-2">
            <HeadphonesIcon className="w-4 h-4 text-brand-400" />
            Soporte IA 24/7
          </div>
        </div>
      </section>

      {/* Pricing Toggle Info */}
      <section className="pt-16 pb-8 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Dos modalidades</p>
              <p className="text-xs text-slate-500 mt-0.5">
                <span className="text-slate-300">Pago único</span> → tú operas &nbsp;|&nbsp;
                <span className="text-cyan-400">Suscripción mensual</span> → nosotros operamos por ti (10% dto.)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="productos" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Catálogo de <span className="text-gradient">Soluciones</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Selecciona los módulos que necesitas. Cada uno funciona de forma
              independiente o integrada con los demás.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => (
              <ProductCard
                key={product.slug}
                product={product}
                onAddToCart={addToCart}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            ¿No sabes cuál elegir?
          </h2>
          <p className="text-slate-400 mb-8">
            Nuestro agente IA puede analizar tu negocio y recomendarte la
            solución perfecta. Haz clic en el chat para comenzar.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2026 AnalitIA · contacto@analitia.cl
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="https://analitia.cl" className="hover:text-white transition-colors">AnalitIA</a>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* AI Chat */}
      <ChatWidget context="sales" />
    </div>
  );
}
