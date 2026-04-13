import { NextRequest, NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

interface CartItem {
  product: {
    name: string;
    slug: string;
    price_once: number;
    price_monthly: number;
  };
  planType: "once" | "monthly";
}

export async function POST(req: NextRequest) {
  try {
    const { items } = (await req.json()) as { items: CartItem[] };

    if (!MP_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Mercado Pago no está configurado. Agrega MERCADOPAGO_ACCESS_TOKEN en .env" },
        { status: 500 }
      );
    }

    // Separar items por tipo de plan
    const onceItems = items.filter((i) => i.planType === "once");
    const monthlyItems = items.filter((i) => i.planType === "monthly");

    // --- PAGO ÚNICO: Crear preferencia de checkout ---
    if (onceItems.length > 0 && monthlyItems.length === 0) {
      const preference = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          items: onceItems.map((item) => ({
            title: item.product.name,
            description: `AnalitIA CFO - ${item.product.name} (Licencia permanente)`,
            quantity: 1,
            unit_price: item.product.price_once,
            currency_id: "CLP",
          })),
          back_urls: {
            success: `${APP_URL}/panel?payment=success`,
            failure: `${APP_URL}/tienda?payment=failure`,
            pending: `${APP_URL}/tienda?payment=pending`,
          },
          auto_return: "approved",
          external_reference: JSON.stringify(
            onceItems.map((i) => ({ slug: i.product.slug, plan: "once" }))
          ),
          notification_url: `${APP_URL}/api/webhooks/mercadopago`,
        }),
      });

      const data = await preference.json();
      return NextResponse.json({ init_point: data.init_point, id: data.id });
    }

    // --- SUSCRIPCIÓN: Crear plan de suscripción ---
    if (monthlyItems.length > 0) {
      // Para suscripciones, creamos un plan por cada producto
      const subscriptionLinks = [];

      for (const item of monthlyItems) {
        const plan = await fetch("https://api.mercadopago.com/preapproval_plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            reason: `AnalitIA CFO - ${item.product.name} (Suscripción mensual con gestión)`,
            auto_recurring: {
              frequency: 1,
              frequency_type: "months",
              transaction_amount: item.product.price_monthly,
              currency_id: "CLP",
            },
            back_url: `${APP_URL}/panel?subscription=success`,
          }),
        });

        const planData = await plan.json();

        // Crear suscripción desde el plan
        const subscription = await fetch("https://api.mercadopago.com/preapproval", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            preapproval_plan_id: planData.id,
            reason: `AnalitIA CFO - ${item.product.name}`,
            external_reference: item.product.slug,
            back_url: `${APP_URL}/panel?subscription=success`,
          }),
        });

        const subData = await subscription.json();
        subscriptionLinks.push({
          product: item.product.name,
          init_point: subData.init_point,
        });
      }

      // Si también hay items de pago único, crear preferencia separada
      if (onceItems.length > 0) {
        // Manejar pago mixto: devolvemos ambos links
        return NextResponse.json({
          init_point: subscriptionLinks[0]?.init_point,
          subscriptions: subscriptionLinks,
          message: "Se crearon las suscripciones. Los pagos únicos se procesan por separado.",
        });
      }

      return NextResponse.json({
        init_point: subscriptionLinks[0]?.init_point,
        subscriptions: subscriptionLinks,
      });
    }

    return NextResponse.json({ error: "No hay items en el carrito" }, { status: 400 });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 });
  }
}
