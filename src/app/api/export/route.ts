import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const format = searchParams.get("format") || "xlsx";
    const module = searchParams.get("module") || "all";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!userId) {
      return NextResponse.json({ error: "userId requerido" }, { status: 400 });
    }

    // Fetch entries
    let query = supabase
      .from("financial_entries")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (module !== "all") {
      query = query.eq("product_slug", module);
    }
    if (from) query = query.gte("date", from);
    if (to) query = query.lte("date", to);

    const { data: entries, error } = await query;
    if (error) throw error;

    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: "No hay datos para exportar" }, { status: 404 });
    }

    // Build workbook
    const wb = XLSX.utils.book_new();

    // Income sheet
    const incomes = entries.filter((e) => e.entry_type === "income");
    if (incomes.length > 0) {
      const ws = XLSX.utils.json_to_sheet(
        incomes.map((e) => ({
          Fecha: e.date,
          Categoría: e.category,
          Descripción: e.description,
          Monto: Number(e.amount),
        }))
      );
      ws["!cols"] = [{ wch: 12 }, { wch: 18 }, { wch: 35 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws, "Ingresos");
    }

    // Expense sheet
    const expenses = entries.filter((e) => e.entry_type === "expense");
    if (expenses.length > 0) {
      const ws = XLSX.utils.json_to_sheet(
        expenses.map((e) => ({
          Fecha: e.date,
          Categoría: e.category,
          Descripción: e.description,
          Monto: Number(e.amount),
        }))
      );
      ws["!cols"] = [{ wch: 12 }, { wch: 18 }, { wch: 35 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws, "Gastos");
    }

    // Summary sheet
    const totalIncome = incomes.reduce((s, e) => s + Number(e.amount), 0);
    const totalExpense = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const summaryData = [
      ["RESUMEN FINANCIERO - AnalitIA CFO"],
      [""],
      ["Período", from || "Todo", to || ""],
      [""],
      ["Total Ingresos", totalIncome],
      ["Total Gastos", totalExpense],
      ["Flujo Neto", totalIncome - totalExpense],
      ["Margen (%)", totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0],
      [""],
      ["Registros totales", entries.length],
      ["Exportado", new Date().toISOString().split("T")[0]],
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Resumen");

    // Categories breakdown
    const categories = new Map<string, { income: number; expense: number }>();
    entries.forEach((e) => {
      const cat = e.category || "Sin categoría";
      const existing = categories.get(cat) || { income: 0, expense: 0 };
      if (e.entry_type === "income") existing.income += Number(e.amount);
      if (e.entry_type === "expense") existing.expense += Number(e.amount);
      categories.set(cat, existing);
    });
    const catData = [["Categoría", "Ingresos", "Gastos", "Neto"]];
    categories.forEach((v, k) => {
      catData.push([k, String(v.income), String(v.expense), String(v.income - v.expense)] as any);
    });
    const catWs = XLSX.utils.aoa_to_sheet(catData);
    catWs["!cols"] = [{ wch: 22 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, catWs, "Por Categoría");

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="analitia-cfo-reporte-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
