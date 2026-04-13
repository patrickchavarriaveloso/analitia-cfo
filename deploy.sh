#!/bin/bash
# ============================================
# AnalitIA CFO — Deploy a Vercel
# ============================================
# Ejecuta este script desde la raíz del proyecto:
# chmod +x deploy.sh && ./deploy.sh

set -e

echo ""
echo "══════════════════════════════════════════"
echo "  AnalitIA CFO — Deploy a Vercel"
echo "══════════════════════════════════════════"
echo ""

# 1. Verificar Node.js
echo "→ Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js no encontrado. Instala desde https://nodejs.org"
    exit 1
fi
echo "  ✓ Node.js $(node -v)"

# 2. Verificar npm
echo "→ Verificando npm..."
echo "  ✓ npm $(npm -v)"

# 3. Instalar dependencias
echo ""
echo "→ Instalando dependencias..."
npm install

# 4. Verificar .env.local
echo ""
if [ ! -f ".env.local" ]; then
    echo "⚠ No se encontró .env.local"
    echo "  Copiando .env.example → .env.local"
    cp .env.example .env.local
    echo ""
    echo "  ⚠ IMPORTANTE: Edita .env.local con tus credenciales antes de deployar:"
    echo "    - NEXT_PUBLIC_SUPABASE_URL"
    echo "    - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "    - SUPABASE_SERVICE_ROLE_KEY"
    echo "    - ANTHROPIC_API_KEY"
    echo "    - MERCADOPAGO_ACCESS_TOKEN"
    echo "    - NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY"
    echo ""
    read -p "  ¿Ya configuraste las credenciales? (s/n): " answer
    if [ "$answer" != "s" ]; then
        echo "  → Edita .env.local y vuelve a ejecutar este script."
        exit 0
    fi
else
    echo "  ✓ .env.local encontrado"
fi

# 5. Build de prueba
echo ""
echo "→ Ejecutando build de prueba..."
npm run build
echo "  ✓ Build exitoso"

# 6. Instalar Vercel CLI
echo ""
echo "→ Verificando Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "  Instalando vercel CLI..."
    npm i -g vercel
fi
echo "  ✓ Vercel CLI instalado"

# 7. Deploy
echo ""
echo "══════════════════════════════════════════"
echo "  Listo para deployar"
echo "══════════════════════════════════════════"
echo ""
echo "  Opciones:"
echo "  1) vercel          → Preview deploy"
echo "  2) vercel --prod   → Production deploy"
echo ""
echo "  La primera vez te pedirá login y configurar el proyecto."
echo "  Después de deployar, agrega las variables de entorno en:"
echo "  https://vercel.com/[tu-usuario]/analitia-cfo/settings/environment-variables"
echo ""
echo "  Variables a configurar en Vercel:"
echo "    NEXT_PUBLIC_SUPABASE_URL"
echo "    NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "    SUPABASE_SERVICE_ROLE_KEY"
echo "    ANTHROPIC_API_KEY"
echo "    MERCADOPAGO_ACCESS_TOKEN"
echo "    NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY"
echo "    MERCADOPAGO_PUBLIC_KEY"
echo "    TWILIO_ACCOUNT_SID"
echo "    TWILIO_AUTH_TOKEN"
echo "    TWILIO_WHATSAPP_NUMBER"
echo "    RESEND_API_KEY"
echo "    NEXT_PUBLIC_APP_URL  (= https://cfo.analitia.cl)"
echo ""

read -p "¿Deployar ahora? (s/n): " deploy
if [ "$deploy" = "s" ]; then
    echo ""
    echo "→ Ejecutando vercel..."
    vercel
    echo ""
    echo "  ✓ Deploy completado!"
    echo ""
    echo "  Para subdominio cfo.analitia.cl:"
    echo "  1. Ve a Vercel → Settings → Domains"
    echo "  2. Agrega: cfo.analitia.cl"
    echo "  3. En tu DNS, agrega CNAME: cfo → cname.vercel-dns.com"
fi

echo ""
echo "══════════════════════════════════════════"
echo "  ¡Setup completo!"
echo "══════════════════════════════════════════"
