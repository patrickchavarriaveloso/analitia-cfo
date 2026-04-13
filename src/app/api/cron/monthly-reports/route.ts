import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMonthlyReport } from "@/lib/emails";



// Vercel Cron: runs on the 1st of each month at 9am
export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy_key"
  );

  // Verify cron secret (Vercel sends this header)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all active monthly subscribers
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("user_id, profiles(email, full_name)")
      .eq("status", "active")
      .eq("plan_type", "monthly");

    if (!subs || subs.length === 0) {
      return NextResponse.json({ sent: 0, message: "No active subscribers" });
    }

    // Get last month's date range
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const from = lastMonth.toISOString().split("T")[0];
    const to = lastMonthEnd.toISOString().split("T")[0];

    let sentCount = 0;
    const uniqueUsers = [...new Set(subs.map((s: any) => s.user_id))];

    for (const userId of uniqueUsers) {
      const sub = subs.find((s: any) => s.user_id === userId) as any;
      const profile = sub?.profiles;
      if (!profile?.email) continue;

      // Get financial data for last month
      const { data: entries } = await supabase
        .from("financial_entries")
        .select("entry_type, amount")
        .eq("user_id", userId)
        .gte("date", from)
        .lte("date", to);

      const income = (entries || [])
        .filter((e: any) => e.entry_type === "income")
        .reduce((s: number, e: any) => s + Number(e.amount), 0);
      const expense = (entries || [])
        .filter((e: any) => e.entry_type === "expense")
        .reduce((s: number, e: any) => s + Number(e.amount), 0);
      const net = income - expense;
      const margin = income > 0 ? (net / income) * 100 : 0;

      try {
        await sendMonthlyReport(profile.email, profile.full_name || "Cliente", {
          income,
          expense,
          net,
          margin,
        });
        sentCount++;
      } catch (e) {
        console.error(`Failed to send report to ${profile.email}:`, e);
      }

      // Rate limit: wait 200ms between emails
      await new Promise((r) => setTimeout(r, 200));
    }

    return NextResponse.json({
      sent: sentCount,
      total: uniqueUsers.length,
      period: `${from} → ${to}`,
    });
  } catch (error: any) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
