"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { useUser } from "@/hooks/useSupabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();

  return (
    <div className="min-h-screen bg-surface-900">
      <Sidebar userName={user?.full_name || user?.email || "Usuario"} />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
      <ChatWidget
        context="financial_advisor"
        initialMessage="¡Hola! Soy tu asesor financiero IA. Puedo ayudarte a analizar tus datos, calcular KPIs, y darte recomendaciones para tu negocio. ¿En qué puedo ayudarte?"
      />
    </div>
  );
}
