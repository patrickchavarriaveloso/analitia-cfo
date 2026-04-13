export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  features: string[];
  price_once: number;
  price_monthly: number;
  category: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  rut: string | null;
  industry: string | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  product_id: string;
  plan_type: "once" | "monthly";
  status: "pending" | "active" | "cancelled" | "expired";
  mp_subscription_id: string | null;
  mp_payment_id: string | null;
  amount: number;
  started_at: string | null;
  expires_at: string | null;
  product?: Product;
}

export interface FinancialEntry {
  id: string;
  user_id: string;
  product_slug: string;
  entry_type: "income" | "expense" | "asset" | "liability";
  category: string;
  subcategory: string | null;
  description: string | null;
  amount: number;
  currency: string;
  date: string;
  metadata: Record<string, unknown>;
}

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  context?: "sales" | "support" | "financial_advisor";
}

export interface CartItem {
  product: Product;
  planType: "once" | "monthly";
}

export interface AdminStats {
  total_users: number;
  active_subscriptions: number;
  monthly_revenue: number;
  recurring_clients: number;
  onetime_clients: number;
}
