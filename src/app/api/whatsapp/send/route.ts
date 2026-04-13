import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const { to, body, template, clientName, productName, price } = await req.json();

    let message = body;

    // Use templates if specified
    if (template === "welcome") {
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cfo.analitia.cl";
      message = `¡Hola ${clientName}! 👋\n\nTu cuenta en AnalitIA CFO está activa. Accede a tu asesor financiero IA aquí:\n\n${APP_URL}/asesor\n\nTambién puedes escribirme directamente por este chat.\n\n— AnalitIA CFO`;
    } else if (template === "payment") {
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cfo.analitia.cl";
      message = `¡Gracias ${clientName}! Tu compra de "${productName}" fue procesada.\n\nAccede a tu panel: ${APP_URL}/panel\n\n— AnalitIA CFO`;
    } else if (template === "reminder") {
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cfo.analitia.cl";
      message = `Hola ${clientName}, es momento de revisar tus finanzas del mes.\n\nDashboard: ${APP_URL}/panel\n\n— AnalitIA CFO`;
    } else if (template === "upsell") {
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cfo.analitia.cl";
      message = `Hola ${clientName}, "${productName}" podría optimizar tu gestión.\n\nPrecio suscriptor: ${price}/mes\n\n${APP_URL}/tienda\n\n— AnalitIA CFO`;
    }

    if (!to || !message) {
      return NextResponse.json({ error: "Faltan parámetros (to, body)" }, { status: 400 });
    }

    const result = await sendWhatsAppMessage({ to, body: message });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
