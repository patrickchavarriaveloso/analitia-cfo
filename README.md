# AnalitIA CFO — Ecosistema de Inteligencia Financiera

Plataforma SaaS de gestión financiera con IA para PYMES chilenas.
Stack: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Supabase + Claude AI + Mercado Pago + Twilio.

## Arquitectura del Ecosistema

```
analitia-cfo/
├── src/app/
│   ├── tienda/           → Catálogo + carrito + checkout
│   ├── (auth)/           → Login y registro (Supabase Auth)
│   ├── (dashboard)/panel/
│   │   ├── page.tsx      → Dashboard principal con KPIs
│   │   ├── flujo-caja/   → Módulo de flujo de caja
│   │   ├── contabilidad/ → Sistema contable (balance, cuentas)
│   │   ├── presupuestos/ → Cotizaciones profesionales
│   │   ├── creditos/     → Evaluación crediticia
│   │   ├── ordenes/      → Órdenes de compra
│   │   ├── saas/         → Métricas SaaS (MRR, Churn, LTV)
│   │   ├── guia/         → Guía educativa interactiva
│   │   └── sesiones/     → Sesiones 1:1 con asesores
│   ├── (admin)/admin/    → Panel de administración
│   └── api/
│       ├── chat/         → Agente IA (Claude API)
│       ├── payments/     → Checkout Mercado Pago
│       └── webhooks/
│           ├── mercadopago/ → Webhook pagos
│           └── whatsapp/    → Webhook Twilio (agente WhatsApp)
├── src/components/
│   ├── chat/ChatWidget   → Chat IA (ventas + soporte + asesor)
│   ├── store/            → ProductCard, CartDrawer
│   ├── dashboard/        → Sidebar
│   └── layout/           → Navbar
├── src/lib/
│   ├── products.ts       → Catálogo de 9 productos
│   ├── ai-prompts.ts     → System prompts (ventas, soporte, asesor)
│   ├── supabase-*.ts     → Clientes Supabase (browser + server)
│   └── utils.ts          → Helpers (formatCLP, cn, etc.)
├── supabase-schema.sql   → Schema completo de BD
└── .env.example          → Variables de entorno
```

## Setup Rápido (10 minutos)

### 1. Clonar y configurar

```bash
# Copiar el proyecto a tu carpeta local
cp -r analitia-cfo /Users/Patri/Documents/Automatizaciones/Analitia\ CFO/

# Entrar y configurar
cd /Users/Patri/Documents/Automatizaciones/Analitia\ CFO/
cp .env.example .env.local
npm install
```

### 2. Configurar Supabase

1. Ir a [supabase.com](https://supabase.com) y crear proyecto
2. En SQL Editor, ejecutar todo el contenido de `supabase-schema.sql`
3. Copiar las keys a `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configurar Mercado Pago

1. Ir a [mercadopago.cl/developers](https://www.mercadopago.cl/developers)
2. Crear aplicación → obtener Access Token y Public Key
3. Agregar a `.env.local`:
   - `MERCADOPAGO_ACCESS_TOKEN`
   - `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
4. Configurar webhook URL: `https://tu-dominio/api/webhooks/mercadopago`

### 4. Configurar Claude AI

1. Obtener API Key de [console.anthropic.com](https://console.anthropic.com)
2. Agregar `ANTHROPIC_API_KEY` a `.env.local`

### 5. Configurar Twilio (WhatsApp)

1. En [twilio.com](https://www.twilio.com), activar WhatsApp sandbox
2. Configurar webhook: `https://tu-dominio/api/webhooks/whatsapp`
3. Agregar credenciales a `.env.local`

### 6. Ejecutar

```bash
npm run dev
# Abrir http://localhost:3000
```

### 7. Deploy en Vercel

```bash
npm i -g vercel
vercel
# Configurar variables de entorno en el dashboard de Vercel
```

## Productos y Precios

| # | Producto | Pago Único | Suscripción (-10%) |
|---|----------|------------|-------------------|
| 1 | Control Total (Contable + Financiero) | $44.990 | $40.491/mes |
| 2 | Flujo de Caja Dashboard 360° | $29.990 | $26.991/mes |
| 3 | Flujo de Caja Profesional | $19.990 | $17.991/mes |
| 4 | Guía de Contabilidad y Finanzas | $19.990 | $17.991/mes |
| 5 | Sesión Estratégica 1:1 | $29.990 | $26.991/mes |
| 6 | Evaluación de Créditos | $39.990 | $35.991/mes |
| 7 | Gestión Financiera SaaS | $29.990 | $26.991/mes |
| 8 | Órdenes de Compra | $19.900 | $17.910/mes |
| 9 | Presupuestos Profesionales | $39.990 | $35.991/mes |

**Pago único** = Self-service (el cliente opera solo)
**Suscripción** = Gestión incluida (AnalitIA opera por el cliente + agente IA)

## Agentes IA

| Agente | Ubicación | Función |
|--------|-----------|---------|
| Sales Agent | Chat en /tienda | Recomienda productos, cierra ventas, upsell |
| Financial Advisor | Chat en /panel | Analiza datos del cliente, da recomendaciones |
| Support Agent | Configurable | Soporte técnico de la plataforma |
| WhatsApp Agent | Twilio webhook | Asesor financiero vía WhatsApp |

## Compatibilidad con AnalitIA Landing

Este proyecto usa el **mismo stack** que tu web principal:
- Next.js 16.1.6 + React 19 + TypeScript + Tailwind 4
- `@ai-sdk/anthropic` para IA
- Framer Motion para animaciones
- Lucide React para iconos

**Para integrar:** Puedes montar este proyecto como subdomain (`cfo.analitia.cl`) o agregar las rutas dentro del proyecto principal en `/Users/Patri/Documents/AnalitIA/website`.

## Dominio

Recomendación: usar `cfo.analitia.cl` como subdominio apuntando a este deploy en Vercel, mientras `analitia.cl` sigue sirviendo la landing actual.
