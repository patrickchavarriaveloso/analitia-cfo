"use client";

import { useState, useRef } from "react";
import { Upload, Download, FileSpreadsheet, Check, AlertCircle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExcelManagerProps {
  template: "flujo-caja" | "contabilidad" | "presupuestos";
  onImport: (entries: any[]) => Promise<void>;
}

export function ExcelManager({ template, onImport }: ExcelManagerProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [result, setResult] = useState<{ parsed: number; errors?: string[] } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const TEMPLATE_NAMES: Record<string, string> = {
    "flujo-caja": "Flujo de Caja",
    contabilidad: "Contabilidad",
    presupuestos: "Presupuestos",
  };

  async function handleFile(file: File) {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setStatus("error");
      setResult({ parsed: 0, errors: ["Formato no soportado. Usa .xlsx, .xls o .csv"] });
      return;
    }

    setStatus("uploading");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("template", template);

      const res = await fetch("/api/excel", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) {
        setStatus("error");
        setResult({ parsed: 0, errors: [data.error] });
        return;
      }

      if (data.entries && data.entries.length > 0) {
        await onImport(data.entries);
      }

      setStatus("success");
      setResult({ parsed: data.parsed, errors: data.errors });
    } catch {
      setStatus("error");
      setResult({ parsed: 0, errors: ["Error de conexión al servidor"] });
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="p-6 rounded-2xl bg-surface-800/60 border border-white/[0.06] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-5 h-5 text-brand-400" />
          <h3 className="text-sm font-bold text-white">Excel — {TEMPLATE_NAMES[template]}</h3>
        </div>
        <a
          href={`/api/excel?template=${template}`}
          download
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-slate-300 border border-white/[0.06] transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Descargar Plantilla
        </a>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
          dragOver
            ? "border-brand-500 bg-brand-600/10"
            : status === "success"
            ? "border-success/30 bg-success/5"
            : status === "error"
            ? "border-danger/30 bg-danger/5"
            : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />

        {status === "uploading" && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            <p className="text-sm text-slate-400">Procesando archivo...</p>
          </div>
        )}

        {status === "success" && result && (
          <div className="flex flex-col items-center gap-3">
            <Check className="w-8 h-8 text-success" />
            <p className="text-sm text-success font-semibold">
              {result.parsed} registros importados correctamente
            </p>
            {result.errors && result.errors.length > 0 && (
              <div className="text-xs text-warning mt-2 space-y-1">
                {result.errors.slice(0, 3).map((e, i) => (
                  <p key={i}>⚠ {e}</p>
                ))}
                {result.errors.length > 3 && (
                  <p>...y {result.errors.length - 3} errores más</p>
                )}
              </div>
            )}
            <button onClick={reset} className="text-xs text-brand-400 hover:text-brand-300 mt-2">
              Subir otro archivo
            </button>
          </div>
        )}

        {status === "error" && result && (
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-danger" />
            <p className="text-sm text-danger font-semibold">{result.errors?.[0]}</p>
            <button onClick={reset} className="text-xs text-brand-400 hover:text-brand-300 mt-2">
              Intentar de nuevo
            </button>
          </div>
        )}

        {status === "idle" && (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-8 h-8 text-slate-500" />
            <div>
              <p className="text-sm text-slate-300">
                Arrastra tu Excel aquí o <span className="text-brand-400">haz clic</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Formatos: .xlsx, .xls, .csv
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
