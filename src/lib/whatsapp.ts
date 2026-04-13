const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WA = process.env.TWILIO_WHATSAPP_NUMBER;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cfo.analitia.cl";

interface SendMessageParams {
  to: string; // formato: +56912345678
  body: string;
}

export async function sendWhatsAppMessage({ to, body }: SendMessageParams) {
  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_WA) {
    console.warn("Twilio not configured");
    return { success: false, error: "Twilio no configurado" };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: TWILIO_WA!,
        To: `whatsapp:${to}`,
        Body: body,
      }),
    });

    const data = await res.json();
    return { success: res.ok, sid: data.sid, error: data.message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── Pre-built message templates ───

export function welcomeMessage(clientName: string) {
  return sendWhatsAppMessage({
    to: "", // se llena desde la BD
    body: `¡Hola ${clientName}! 👋\n\nTu cuenta en AnalitIA CFO está activa. Accede a tu asesor financiero IA aquí:\n\n${APP_URL}/asesor\n\nTambién puedes escribirme directamente por este chat y te ayudo con cualquier consulta financiera.\n\n— AnalitIA CFO`,
  });
}

export function paymentConfirmationMessage(clientName: string, productName: string) {
  return `¡Gracias ${clientName}! Tu compra de "${productName}" fue procesada correctamente.\n\nAccede a tu panel: ${APP_URL}/panel\n\nSi tienes dudas, escríbeme aquí o usa el chat en tu dashboard.\n\n— AnalitIA CFO`;
}

export function monthlyReminderMessage(clientName: string) {
  return `Hola ${clientName}, es momento de revisar tus finanzas del mes.\n\nTu dashboard está actualizado: ${APP_URL}/panel\n\n¿Necesitas ayuda con algo? Escríbeme.\n\n— AnalitIA CFO`;
}

export function upsellMessage(clientName: string, productName: string, price: string) {
  return `Hola ${clientName}, basado en tu uso de la plataforma, "${productName}" podría ayudarte a optimizar aún más tu gestión.\n\nPrecio especial suscriptor: ${price}/mes\n\nMás info: ${APP_URL}/tienda\n\n— AnalitIA CFO`;
}
