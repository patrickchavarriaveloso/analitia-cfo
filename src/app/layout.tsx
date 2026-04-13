import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnalitIA CFO | Inteligencia Financiera para PYMES",
  description:
    "Plataforma de gestión financiera con IA. Contabilidad, flujo de caja, presupuestos y más. Automatiza tus finanzas.",
  keywords: ["finanzas", "contabilidad", "PYME", "Chile", "IA", "flujo de caja"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-900 text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
