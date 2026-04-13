import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPaymentConfirmation } from "@/lib/emails";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { formatCLP } from "@/lib/utils";



export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy_key"
  );
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === "payment") {
      const paymentRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${data.id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );
      const payment = await paymentRes.json();

      if (payment.status === "approved") {
        const { data: profiles } = await supabaseAdmin
          .from("profiles")
          .select("id, email, full_name, phone")
          .eq("email", payment.payer?.email)
          .limit(1);

        if (profiles && profiles.length > 0) {
          const profile = profiles[0];
          const externalRef = JSON.parse(payment.external_reference || "[]");

          for (const item of externalRef) {
            const { data: product } = await supabaseAdmin
              .from("products")
              .select("id, name, price_once, price_monthly")
              .eq("slug", item.slug)
              .single();

            if (product) {
              const planType = item.plan || "once";
              const amount = planType === "monthly" ? product.price_monthly : product.price_once;

              await supabaseAdmin.from("subscriptions").insert({
                user_id: profile.id,
                product_id: product.id,
                plan_type: planType,
                status: "active",
                mp_payment_id: String(data.id),
                amount,
                started_at: new Date().toISOString(),
              });

              // Send email confirmation
              try {
                await sendPaymentConfirmation(
                  profile.email,
                  profile.full_name || "Cliente",
                  product.name,
                  formatCLP(amount),
                  planType
                );
              } catch (e) { console.error("Email error:", e); }

              // Send WhatsApp confirmation
              if (profile.phone) {
                try {
                  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cfo.analitia.cl";
                  await sendWhatsAppMessage({
                    to: profile.phone,
                    body: `¡Gracias ${profile.full_name || ""}! Tu ${planType === "monthly" ? "suscripción a" : "compra de"} "${product.name}" fue confirmada.\n\nAccede a tu panel: ${APP_URL}/panel\n\n— AnalitIA CFO`,
                  });
                } catch (e) { console.error("WhatsApp error:", e); }
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
