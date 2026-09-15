"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GraciasPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);
  const [lang, setLang] = useState<"es" | "en">("es");
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShouldRedirect(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Efecto separado para la navegación
  useEffect(() => {
    if (shouldRedirect) {
      router.push("/");
    }
  }, [shouldRedirect, router]);

  const text = {
    titleEs: "¡Gracias por confirmar!",
    titleEn: "Thank you for confirming!",

    descriptionEs:
      "Tu confirmación ha sido enviada exitosamente. Nos emociona mucho celebrar contigo este día tan especial.",
    descriptionEn:
      "Your confirmation has been sent successfully. We're very excited to celebrate this special day with you.",

    redirectEs: "Volviendo al inicio en",
    redirectEn: "Returning to home in",

    secondsEs: "segundos",
    secondsEn: "seconds",

    goHomeEs: "Ir al inicio ahora",
    goHomeEn: "Go to home now",

    contactEs: "¿Tienes alguna duda?",
    contactEn: "Any questions?",

    contactInfoEs: "Escríbenos a: email@mail.com",
    contactInfoEn: "Write to us at: email@mail.com",
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        {/* Icono de check */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-serif font-semibold text-[var(--foreground)] mb-4">
          {lang === "es" ? text.titleEs : text.titleEn}
        </h1>

        {/* Descripción */}
        <p className="text-[var(--foreground-muted)] mb-8 leading-relaxed">
          {lang === "es" ? text.descriptionEs : text.descriptionEn}
        </p>

        {/* Información de contacto */}
        <div className="mb-8 p-4 rounded-lg bg-[var(--background-alt)]">
          <p className="text-sm font-medium text-[var(--foreground)] mb-2">
            {lang === "es" ? text.contactEs : text.contactEn}
          </p>
          <p className="text-sm text-[var(--foreground-muted)]">
            {lang === "es" ? text.contactInfoEs : text.contactInfoEn}
          </p>
        </div>

        {/* Countdown */}
        <div className="mb-6">
          <p className="text-sm text-[var(--foreground-muted)]">
            {lang === "es" ? text.redirectEs : text.redirectEn}{" "}
            <span className="font-semibold text-[var(--accent)]">
              {countdown} {lang === "es" ? text.secondsEs : text.secondsEn}
            </span>
          </p>
        </div>

        {/* Botón de ir al inicio */}
        <button
          onClick={() => router.push("/")}
          className="inline-block rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-dark)]"
        >
          {lang === "es" ? text.goHomeEs : text.goHomeEn}
        </button>

        {/* Switch de idioma */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setLang((current) => (current === "es" ? "en" : "es"))}
            className="text-xs px-3 py-1.5 rounded border border-[var(--background-alt)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)] transition"
            aria-label="Cambiar idioma / Switch language"
          >
            {lang === "es" ? "English" : "Español"}
          </button>
        </div>
      </div>
    </main>
  );
}