import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "AnalitIA CFO <noreply@analitia.cl>";

export async function sendWelcomeEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) return;

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cfo.analitia.cl";

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Bienvenido a AnalitIA CFO",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:24px;font-weight:800;color:#0f172a;margin:0;">
            Analit<span style="color:#0d6de1;">IA</span> <span style="color:#06b6d4;font-size:14px;">CFO</span>
          </h1>
        </div>
        <h2 style="font-size:20px;color:#0f172a;margin-bottom:8px;">¡Hola ${name}!</h2>
        <p style="color:#64748b;line-height:1.7;margin-bottom:24px;">
          Tu cuenta en AnalitIA CFO está activa. Ya puedes acceder a tu panel financiero
          y comenzar a gestionar las finanzas de tu negocio con inteligencia artificial.
        </p>
        <a href="${APP_URL}/panel" style="display:inline-block;background:#0d6de1;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;font-size:14px;">
          Acceder a mi Panel →
        </a>
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:13px;">
            También puedes consultar a tu asesor IA en cualquier momento:<br/>
            <a href="${APP_URL}/asesor" style="color:#0d6de1;">${APP_URL}/asesor</a>
          </p>
        </div>
        <p style="color:#cbd5e1;font-size:11px;margin-top:32px;">
          © 2026 AnalitIA · contacto@analitia.cl
        </p>
      </div>
    `,
  });
}

export async function sendPaymentConfirmation(
  to: string,
  name: string,
  productName: string,
  amount: string,
  planType: "once" | "monthly"
) {
  if (!process.env.RESEND_API_KEY) return;

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cfo.analitia.cl";

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Confirmación de compra — ${productName}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:24px;font-weight:800;color:#0f172a;margin:0;">
            Analit<span style="color:#0d6de1;">IA</span> <span style="color:#06b6d4;font-size:14px;">CFO</span>
          </h1>
        </div>
        <h2 style="font-size:20px;color:#0f172a;margin-bottom:8px;">¡Pago confirmado!</h2>
        <p style="color:#64748b;line-height:1.7;margin-bottom:16px;">
          Hola ${name}, tu ${planType === "monthly" ? "suscripción a" : "compra de"} 
          <strong>${productName}</strong> fue procesada correctamente.
        </p>
        <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin-bottom:24px;">
          <table style="width:100%;font-size:14px;">
            <tr>
              <td style="color:#64748b;padding:4px 0;">Producto</td>
              <td style="color:#0f172a;font-weight:600;text-align:right;">${productName}</td>
            </tr>
            <tr>
              <td style="color:#64748b;padding:4px 0;">Monto</td>
              <td style="color:#0f172a;font-weight:600;text-align:right;">${amount}</td>
            </tr>
            <tr>
              <td style="color:#64748b;padding:4px 0;">Plan</td>
              <td style="color:#0f172a;font-weight:600;text-align:right;">
                ${planType === "monthly" ? "Suscripción mensual (gestión incluida)" : "Pago único (self-service)"}
              </td>
            </tr>
          </table>
        </div>
        <a href="${APP_URL}/panel" style="display:inline-block;background:#0d6de1;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;font-size:14px;">
          Ir a mi Dashboard →
        </a>
        <p style="color:#cbd5e1;font-size:11px;margin-top:32px;">
          © 2026 AnalitIA · contacto@analitia.cl
        </p>
      </div>
    `,
  });
}

export async function sendMonthlyReport(
  to: string,
  name: string,
  data: { income: number; expense: number; net: number; margin: number }
) {
  if (!process.env.RESEND_API_KEY) return;

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cfo.analitia.cl";
  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(n);

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Tu resumen financiero mensual — AnalitIA CFO",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:24px;font-weight:800;color:#0f172a;margin:0;">
            Analit<span style="color:#0d6de1;">IA</span> <span style="color:#06b6d4;font-size:14px;">CFO</span>
          </h1>
        </div>
        <h2 style="font-size:20px;color:#0f172a;margin-bottom:8px;">Resumen del mes</h2>
        <p style="color:#64748b;line-height:1.7;margin-bottom:16px;">
          Hola ${name}, aquí tienes el resumen de tu actividad financiera:
        </p>
        <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin-bottom:24px;">
          <table style="width:100%;font-size:14px;">
            <tr>
              <td style="color:#64748b;padding:8px 0;">Ingresos</td>
              <td style="color:#10b981;font-weight:700;text-align:right;">${fmt(data.income)}</td>
            </tr>
            <tr>
              <td style="color:#64748b;padding:8px 0;">Gastos</td>
              <td style="color:#ef4444;font-weight:700;text-align:right;">${fmt(data.expense)}</td>
            </tr>
            <tr style="border-top:1px solid #e2e8f0;">
              <td style="color:#0f172a;font-weight:700;padding:8px 0;">Flujo neto</td>
              <td style="color:${data.net >= 0 ? "#06b6d4" : "#ef4444"};font-weight:700;text-align:right;">${fmt(data.net)}</td>
            </tr>
            <tr>
              <td style="color:#64748b;padding:4px 0;">Margen</td>
              <td style="color:#0f172a;font-weight:600;text-align:right;">${data.margin.toFixed(1)}%</td>
            </tr>
          </table>
        </div>
        <a href="${APP_URL}/panel" style="display:inline-block;background:#0d6de1;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;font-size:14px;">
          Ver Dashboard Completo →
        </a>
        <p style="color:#cbd5e1;font-size:11px;margin-top:32px;">
          © 2026 AnalitIA · contacto@analitia.cl
        </p>
      </div>
    `,
  });
}
