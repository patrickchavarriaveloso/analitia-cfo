-- ============================================
-- ANALITIA CFO - Schema de Base de Datos
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Extensiones
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLA: profiles (extensión de auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  company_name text,
  phone text,
  rut text,
  industry text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Trigger para crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- TABLA: products (catálogo de productos)
-- ============================================
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text,
  features jsonb default '[]',
  price_once integer not null, -- precio pago único en CLP (centavos)
  price_monthly integer not null, -- precio suscripción mensual en CLP
  category text not null default 'finanzas',
  icon text default 'calculator',
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.products enable row level security;
create policy "Anyone can view active products" on public.products for select using (is_active = true);

-- Insertar los 9 productos
insert into public.products (slug, name, description, price_once, price_monthly, features, icon, sort_order) values
('control-total', 'Control Total: Sistema Contable & Financiero', 'Sistema contable completo con balance general, estado de resultados, ratios financieros y dashboard ejecutivo. Todo automatizado.', 44990, 40491, '["Balance General automático", "Estado de Resultados", "Ratios de liquidez y rentabilidad", "Dashboard ejecutivo web", "Exportación PDF", "Flujo de caja 24 meses incluido"]', 'shield-check', 1),
('flujo-caja-premium', 'Flujo de Caja | Dashboard 360°', 'Control integral de cashflow, gastos, créditos y activos con dashboard web en tiempo real y +20 KPIs automáticos.', 29990, 26991, '["CashFlow integrado", "Control de gastos por categoría", "Gestión de créditos", "Control de activos", "20+ KPIs automáticos", "Dashboard web interactivo"]', 'trending-up', 2),
('flujo-caja-profesional', 'Flujo de Caja Empresarial Profesional', 'Plantilla profesional para proyección y control de flujo de caja con análisis de tendencias y alertas automáticas.', 19990, 17991, '["Proyección a 12 meses", "Análisis de tendencias", "Alertas de liquidez", "Categorización automática", "Reportes mensuales"]', 'bar-chart-3', 3),
('guia-finanzas', 'Guía Contabilidad y Finanzas para Dueños de Negocios', 'Guía completa para entender y gestionar la contabilidad y finanzas de tu negocio sin ser contador.', 19990, 17991, '["Fundamentos contables", "Interpretación de estados financieros", "Gestión tributaria básica", "Indicadores clave", "Casos prácticos Chile"]', 'book-open', 4),
('sesion-estrategica', 'Sesión Estratégica 1:1 con Ingeniero en Finanzas', 'Sesión personalizada de 60 minutos con un especialista para resolver dudas financieras y definir estrategia.', 29990, 26991, '["60 minutos de consultoría", "Análisis de tu situación actual", "Plan de acción personalizado", "Seguimiento por email", "Grabación de la sesión"]', 'users', 5),
('evaluacion-creditos', 'Sistema de Evaluación de Créditos', 'Evalúa la viabilidad crediticia de clientes y proveedores con scoring automatizado y análisis de riesgo.', 39990, 35991, '["Scoring crediticio automático", "Análisis de riesgo", "Historial de evaluaciones", "Reportes de decisión", "Integración con datos SII"]', 'credit-card', 6),
('gestion-saas', 'Sistema de Gestión Financiera para Negocios SaaS', 'Métricas financieras específicas para SaaS: MRR, ARR, Churn, LTV, CAC y unit economics.', 29990, 26991, '["MRR/ARR tracking", "Churn analysis", "LTV y CAC", "Unit economics", "Cohort analysis", "Revenue forecasting"]', 'cloud', 7),
('ordenes-compra', 'Sistema de Órdenes de Compra', 'Gestión completa de órdenes de compra con aprobaciones, seguimiento y control presupuestario.', 19900, 17910, '["Generación de OC automática", "Flujo de aprobaciones", "Control presupuestario", "Seguimiento de entregas", "Historial de proveedores"]', 'shopping-cart', 8),
('presupuestos', 'Sistema de Presupuestos Profesionales', 'Crea presupuestos profesionales con plantillas personalizables, seguimiento y conversión a factura.', 39990, 35991, '["Plantillas personalizables", "Cálculo automático IVA", "Seguimiento de estado", "Conversión a factura", "Reportes de conversión"]', 'file-text', 9);

-- ============================================
-- TABLA: subscriptions
-- ============================================
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  plan_type text not null check (plan_type in ('once', 'monthly')),
  status text not null default 'pending' check (status in ('pending', 'active', 'cancelled', 'expired')),
  mp_subscription_id text, -- ID de Mercado Pago
  mp_payment_id text,
  amount integer not null,
  started_at timestamptz,
  expires_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz default now()
);

alter table public.subscriptions enable row level security;
create policy "Users can view own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);

-- ============================================
-- TABLA: financial_entries (datos financieros del cliente)
-- ============================================
create table public.financial_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_slug text not null,
  entry_type text not null check (entry_type in ('income', 'expense', 'asset', 'liability')),
  category text not null,
  subcategory text,
  description text,
  amount numeric(15,2) not null,
  currency text default 'CLP',
  date date not null default current_date,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

alter table public.financial_entries enable row level security;
create policy "Users can manage own entries" on public.financial_entries for all using (auth.uid() = user_id);

-- Índices para performance
create index idx_entries_user on public.financial_entries(user_id);
create index idx_entries_date on public.financial_entries(date);
create index idx_entries_type on public.financial_entries(entry_type);
create index idx_subs_user on public.subscriptions(user_id);
create index idx_subs_status on public.subscriptions(status);

-- ============================================
-- TABLA: chat_messages (historial de conversaciones IA)
-- ============================================
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  session_id text not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  context text default 'sales', -- sales | support | financial_advisor
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

alter table public.chat_messages enable row level security;
create policy "Users can view own chats" on public.chat_messages for select using (auth.uid() = user_id);
create policy "Users can insert chats" on public.chat_messages for insert with check (auth.uid() = user_id);

-- ============================================
-- VISTA: dashboard_stats (para panel admin)
-- ============================================
create or replace view public.admin_stats as
select
  (select count(*) from public.profiles) as total_users,
  (select count(*) from public.subscriptions where status = 'active') as active_subscriptions,
  (select coalesce(sum(amount), 0) from public.subscriptions where status = 'active') as monthly_revenue,
  (select count(*) from public.subscriptions where status = 'active' and plan_type = 'monthly') as recurring_clients,
  (select count(*) from public.subscriptions where status = 'active' and plan_type = 'once') as onetime_clients;
