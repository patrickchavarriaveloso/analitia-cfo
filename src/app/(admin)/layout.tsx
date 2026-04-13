import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-900">
      {/* Admin navbar */}
      <nav className="border-b border-white/[0.06] bg-surface-800/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-lg font-extrabold text-white">
            Analit<span className="text-brand-500">IA</span>
            <span className="text-cyan-400 text-xs ml-1">ADMIN</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 ml-8 text-sm">
            <Link href="/admin" className="text-slate-300 hover:text-white">Dashboard</Link>
            <Link href="/admin#clients" className="text-slate-400 hover:text-white">Clientes</Link>
            <Link href="/admin#products" className="text-slate-400 hover:text-white">Productos</Link>
            <Link href="/admin/whatsapp" className="text-slate-400 hover:text-white">WhatsApp</Link>
          </div>
        </div>
        <Link href="/tienda" className="text-sm text-slate-400 hover:text-white">← Ir a la tienda</Link>
      </nav>
      <main className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
