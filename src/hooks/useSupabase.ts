"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { Profile, Subscription, FinancialEntry, Product } from "@/types";

// ─── Auth hook ───
export function useUser() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        setUser(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single();
    if (!error && data) setUser(data);
    return { data, error };
  }, [user]);

  return { user, loading, signOut, updateProfile };
}

// ─── Subscriptions hook ───
export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<(Subscription & { product: Product })[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("subscriptions")
        .select("*, product:products(*)")
        .in("status", ["active", "pending"])
        .order("created_at", { ascending: false });
      if (data) setSubscriptions(data as any);
      setLoading(false);
    }
    load();
  }, []);

  const hasProduct = useCallback((slug: string) => {
    return subscriptions.some(
      (s) => s.product?.slug === slug && s.status === "active"
    );
  }, [subscriptions]);

  return { subscriptions, loading, hasProduct };
}

// ─── Financial entries hook ───
export function useFinancialEntries(productSlug?: string) {
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadEntries = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("financial_entries")
      .select("*")
      .order("date", { ascending: false })
      .limit(200);

    if (productSlug) {
      query = query.eq("product_slug", productSlug);
    }

    const { data } = await query;
    if (data) setEntries(data);
    setLoading(false);
  }, [productSlug]);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const addEntry = useCallback(async (entry: Omit<FinancialEntry, "id" | "user_id" | "created_at">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data, error } = await supabase
      .from("financial_entries")
      .insert({ ...entry, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setEntries((prev) => [data, ...prev]);
    }
    return { data, error };
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("financial_entries")
      .delete()
      .eq("id", id);

    if (!error) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
    return { error };
  }, []);

  const bulkInsert = useCallback(async (newEntries: Omit<FinancialEntry, "id" | "user_id" | "created_at">[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const withUserId = newEntries.map((e) => ({ ...e, user_id: user.id }));
    const { data, error } = await supabase
      .from("financial_entries")
      .insert(withUserId)
      .select();

    if (!error && data) {
      setEntries((prev) => [...data, ...prev]);
    }
    return { data, error };
  }, []);

  // ─── KPI calculations ───
  const kpis = {
    totalIncome: entries.filter((e) => e.entry_type === "income").reduce((s, e) => s + Number(e.amount), 0),
    totalExpense: entries.filter((e) => e.entry_type === "expense").reduce((s, e) => s + Number(e.amount), 0),
    totalAssets: entries.filter((e) => e.entry_type === "asset").reduce((s, e) => s + Number(e.amount), 0),
    totalLiabilities: entries.filter((e) => e.entry_type === "liability").reduce((s, e) => s + Number(e.amount), 0),
    get netFlow() { return this.totalIncome - this.totalExpense; },
    get patrimony() { return this.totalAssets - this.totalLiabilities; },
    get grossMargin() { return this.totalIncome > 0 ? ((this.netFlow / this.totalIncome) * 100) : 0; },
    get currentRatio() { return this.totalLiabilities > 0 ? (this.totalAssets / this.totalLiabilities) : 0; },
  };

  return { entries, loading, addEntry, deleteEntry, bulkInsert, kpis, reload: loadEntries };
}

// ─── Products hook ───
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (data) setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  return { products, loading };
}
