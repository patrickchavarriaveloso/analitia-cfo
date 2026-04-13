# Integración AnalitIA CFO ↔ AnalitIA Website

## Opción 1: Subdominio (RECOMENDADA)

La forma más limpia de integrar ambos proyectos:

```
analitia.cl         → Tu landing actual (Antigravity)
cfo.analitia.cl     → AnalitIA CFO (este proyecto)
```

### Configuración en Vercel:

1. Despliega este proyecto en Vercel
2. En Settings > Domains, agrega `cfo.analitia.cl`
3. En tu proveedor DNS (donde compraste analitia.cl), agrega:
   - CNAME: `cfo` → `cname.vercel-dns.com`

### Enlazar desde tu landing:

En tu proyecto de AnalitIA (`/Users/Patri/Documents/AnalitIA/website/`):

```tsx
// Agrega en tu .env.local
NEXT_PUBLIC_CFO_URL=https://cfo.analitia.cl
```

Copia el archivo `src/components/integration/CFOBanner.tsx` a tu proyecto
principal y agrégalo donde quieras en tu landing.


## Opción 2: Rutas internas (mismo proyecto)

Si prefieres tener todo en un solo proyecto Next.js:

1. Copia toda la carpeta `src/app/tienda/` a tu proyecto principal
2. Copia `src/app/(dashboard)/` a tu proyecto principal
3. Copia `src/app/(admin)/` a tu proyecto principal
4. Copia `src/app/(auth)/` a tu proyecto principal
5. Copia `src/app/api/` (chat, payments, webhooks, excel, export)
6. Copia `src/components/` (chat, store, dashboard)
7. Copia `src/lib/` y `src/hooks/` y `src/types/`
8. Instala dependencias adicionales:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr mercadopago xlsx recharts zod twilio
   ```
9. Agrega las variables de entorno del `.env.example`

Las rutas quedarían:
```
analitia.cl/tienda     → Catálogo
analitia.cl/panel      → Dashboard
analitia.cl/admin      → Admin
analitia.cl/asesor     → Chat IA público
analitia.cl/login      → Auth
```


## Opción 3: Iframe / Widget embebido

Para integrar solo el chat en tu landing actual:

```html
<!-- Agregar antes de </body> en tu landing -->
<script>
  (function() {
    var btn = document.createElement('a');
    btn.href = 'https://cfo.analitia.cl/asesor';
    btn.target = '_blank';
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;width:56px;height:56px;border-radius:50%;background:#0d6de1;box-shadow:0 4px 24px rgba(13,109,225,0.35);display:flex;align-items:center;justify-content:center;text-decoration:none;';
    btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
    document.body.appendChild(btn);
  })();
</script>
```


## Flujo completo del cliente

```
1. Cliente ve analitia.cl (landing)
   └─ Sección "Ecosistema" → click "Contabilidad y Finanzas"
   └─ O click en chatbot FAB

2. Llega a cfo.analitia.cl/tienda
   └─ Chatbot IA de ventas le recomienda producto
   └─ Elige plan (único o suscripción)
   └─ Checkout → Mercado Pago

3. Mercado Pago confirma pago
   └─ Webhook activa la suscripción
   └─ Email de bienvenida (Resend)
   └─ WhatsApp de bienvenida (Twilio)

4. Cliente accede a cfo.analitia.cl/panel
   └─ Dashboard con sus módulos activos
   └─ Puede subir Excel / usar interfaz web
   └─ Asesor IA disponible 24/7

5. WhatsApp: cliente recibe link a /asesor
   └─ Chat IA responde consultas financieras
   └─ Puede derivar a compra de productos adicionales

6. Admin en cfo.analitia.cl/admin
   └─ Ve todos los clientes y suscripciones
   └─ Envía mensajes WhatsApp masivos
   └─ Gestiona productos y precios
```
