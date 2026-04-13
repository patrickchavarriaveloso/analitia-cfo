"use client";

import { BookOpen, CheckCircle, Lock, PlayCircle, FileText, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  { id: 1, title: "Fundamentos Contables", lessons: 5, completed: 5, unlocked: true },
  { id: 2, title: "Estados Financieros", lessons: 4, completed: 3, unlocked: true },
  { id: 3, title: "Flujo de Caja y Liquidez", lessons: 6, completed: 0, unlocked: true },
  { id: 4, title: "Indicadores Clave (KPIs)", lessons: 5, completed: 0, unlocked: false },
  { id: 5, title: "Gestión Tributaria en Chile", lessons: 7, completed: 0, unlocked: false },
  { id: 6, title: "Planificación Financiera", lessons: 4, completed: 0, unlocked: false },
];

export default function GuiaPage() {
  const totalLessons = CHAPTERS.reduce((s, c) => s + c.lessons, 0);
  const completedLessons = CHAPTERS.reduce((s, c) => s + c.completed, 0);
  const progress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Guía de Contabilidad y Finanzas</h1>
        <p className="text-sm text-slate-500 mt-1">Aprende a gestionar las finanzas de tu negocio</p>
      </div>

      {/* Progress */}
      <div className="p-6 rounded-2xl bg-surface-800/60 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm font-bold text-white">Tu Progreso</p>
              <p className="text-xs text-slate-500">{completedLessons} de {totalLessons} lecciones completadas</p>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-brand-400">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-surface-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-600 to-cyan-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-4">
        {CHAPTERS.map((ch) => {
          const chProgress = ch.lessons > 0 ? Math.round((ch.completed / ch.lessons) * 100) : 0;
          return (
            <div
              key={ch.id}
              className={cn(
                "p-5 rounded-2xl border transition-all",
                ch.unlocked
                  ? "bg-surface-800/60 border-white/[0.06] hover:border-brand-500/30 cursor-pointer card-glow"
                  : "bg-surface-800/30 border-white/[0.03] opacity-60"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold",
                  chProgress === 100 ? "bg-success/15 text-success" : ch.unlocked ? "bg-brand-600/15 text-brand-400" : "bg-surface-700 text-slate-600"
                )}>
                  {chProgress === 100 ? <CheckCircle className="w-6 h-6" /> : ch.unlocked ? ch.id : <Lock className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{ch.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{ch.lessons} lecciones · {ch.completed} completadas</p>
                  {ch.unlocked && chProgress < 100 && (
                    <div className="w-full max-w-xs h-1.5 bg-surface-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${chProgress}%` }} />
                    </div>
                  )}
                </div>
                {ch.unlocked && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-white transition-colors">
                    <PlayCircle className="w-4 h-4" />
                    {chProgress > 0 && chProgress < 100 ? "Continuar" : chProgress === 100 ? "Repasar" : "Comenzar"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
