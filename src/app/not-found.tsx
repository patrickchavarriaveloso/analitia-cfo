import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-brand-500 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Página no encontrada</h1>
        <p className="text-slate-500 mb-8">La página que buscas no existe o fue movida.</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/tienda"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm"
          >
            Ir a la Tienda
          </Link>
          <Link
            href="/panel"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-sm border border-white/10"
          >
            Mi Panel
          </Link>
        </div>
      </div>
    </div>
  );
}
