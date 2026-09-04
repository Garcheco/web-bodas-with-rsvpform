import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  const recipient = process.env.FORMSUBMIT_EMAIL;
  const ccRecipient = process.env.FORMSUBMIT_CC_EMAIL;

  if (!recipient) {
    return NextResponse.json(
      { error: "La configuración de RSVP no está disponible." },
      { status: 500 }
    );
  }

  const submission = new URLSearchParams();

  submission.set("_subject", "Nueva confirmación RSVP - Boda Edgard");
  submission.set("_captcha", "false");

  if (ccRecipient) {
    submission.set("_cc", ccRecipient);
  }

  submission.set("Nombre", String(formData.get("nombre") ?? ""));
  submission.set("Correo electrónico", String(formData.get("email") ?? ""));
  submission.set("WhatsApp", String(formData.get("whatsapp") ?? ""));
  submission.set("Asistencia", String(formData.get("asistencia") ?? ""));
  submission.set(
    "Número de invitados",
    String(formData.get("invitados") ?? "")
  );
  submission.set("Mensaje", String(formData.get("mensaje") ?? ""));
  submission.set(
    "Canción que no puede faltar",
    String(formData.get("cancionSi") ?? "")
  );

  try {
    const response = await fetch(`https://formsubmit.co/${recipient}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: submission.toString(),
      redirect: "manual",
    });

    if (!response.ok && response.status !== 302 && response.status !== 303) {
      return NextResponse.json(
        { error: "No fue posible enviar la confirmación." },
        { status: 502 }
      );
    }

    return NextResponse.redirect(
      new URL("/rsvp/gracias", request.url),
      { status: 303 }
    );
  } catch {
    return NextResponse.json(
      { error: "No fue posible enviar la confirmación." },
      { status: 502 }
    );
  }
}