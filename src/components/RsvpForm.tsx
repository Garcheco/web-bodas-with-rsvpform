"use client";

import { useState } from "react";

type FormData = {
  nombre: string;
  email: string;
  whatsapp: string;
  asistencia: "" | "Sí" | "No";
  invitados: string;
  mensaje: string;
  cancionSi: string;
};

export default function RsvpForm() {
  const [lang, setLang] = useState<"es" | "en">("es");

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    whatsapp: "",
    asistencia: "",
    invitados: "",
    mensaje: "",
    cancionSi: "",
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const text = {
    titleEs: "Confirma tu asistencia",
    titleEn: "Confirm your attendance",

    descriptionEs:
      "Por favor, confirma tu asistencia antes de la fecha indicada.",
    descriptionEn:
      "Please confirm your attendance before the indicated date.",

    nombreEs: "Nombre completo",
    nombreEn: "Full name",

    emailEs: "Correo electrónico",
    emailEn: "Email",

    whatsappEs: "Número de WhatsApp (con código de país)",
    whatsappEn: "WhatsApp number (with country code)",

    asistenciaEs: "¿Asistirás?",
    asistenciaEn: "Will you attend?",

    seleccionaEs: "Selecciona una opción",
    seleccionaEn: "Select an option",

    siEs: "Sí",
    siEn: "Yes",

    noEs: "No",
    noEn: "No",

    invitadosEs: "Número de invitados (incluyéndote)",
    invitadosEn: "Number of guests (including you)",

    mensajeEs: "Mensaje o comentarios (opcional)",
    mensajeEn: "Message or comments (optional)",

    cancionEs: "¿Alguna canción que no pueda faltar? (opcional)",
    cancionEn: "Any song that must play? (optional)",

    enviarEs: "Enviar confirmación",
    enviarEn: "Send confirmation",
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-serif font-semibold text-[var(--foreground)]">
          {lang === "es" ? text.titleEs : text.titleEn}
        </h3>

        <button
          type="button"
          onClick={() => setLang((current) => (current === "es" ? "en" : "es"))}
          className="text-xs px-2 py-1 rounded border border-[var(--background-alt)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)] transition"
          aria-label="Cambiar idioma / Switch language"
        >
          {lang === "es" ? "EN" : "ES"}
        </button>
      </div>

      <p className="mb-6 text-sm text-[var(--foreground-muted)]">
        {lang === "es" ? text.descriptionEs : text.descriptionEn}
      </p>

      <form
        action="https://formsubmit.co/sevcho11@gmail.com"
        method="POST"
        className="space-y-4"
      >
        <input
          type="hidden"
          name="_subject"
          value="Nueva confirmación RSVP - Boda C&E"
        />

        <input
          type="hidden"
          name="_next"
          value="https://boda-edgard.vercel.app/rsvp/gracias"
        />

        <input type="hidden" name="_captcha" value="false" />

        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            {lang === "es" ? text.nombreEs : text.nombreEn}
          </label>

          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            value={formData.nombre}
            onChange={handleChange}
            placeholder={lang === "es" ? text.nombreEs : text.nombreEn}
            className="mt-1 w-full rounded-md border border-[var(--background-alt)] bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            {lang === "es" ? text.emailEs : text.emailEn}
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder={lang === "es" ? text.emailEs : text.emailEn}
            className="mt-1 w-full rounded-md border border-[var(--background-alt)] bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label
            htmlFor="whatsapp"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            {lang === "es" ? text.whatsappEs : text.whatsappEn}
          </label>

          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            required
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="+52 669 123 4567"
            className="mt-1 w-full rounded-md border border-[var(--background-alt)] bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label
            htmlFor="asistencia"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            {lang === "es" ? text.asistenciaEs : text.asistenciaEn}
          </label>

          <select
            id="asistencia"
            name="asistencia"
            required
            value={formData.asistencia}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-[var(--background-alt)] bg-white px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          >
            <option value="">
              {lang === "es" ? text.seleccionaEs : text.seleccionaEn}
            </option>

            <option value="Sí">{lang === "es" ? text.siEs : text.siEn}</option>

            <option value="No">{lang === "es" ? text.noEs : text.noEn}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="invitados"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            {lang === "es" ? text.invitadosEs : text.invitadosEn}
          </label>

          <input
            id="invitados"
            name="invitados"
            type="number"
            min="1"
            required
            value={formData.invitados}
            onChange={handleChange}
            placeholder="1"
            className="mt-1 w-full rounded-md border border-[var(--background-alt)] bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label
            htmlFor="mensaje"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            {lang === "es" ? text.mensajeEs : text.mensajeEn}
          </label>

          <textarea
            id="mensaje"
            name="mensaje"
            rows={3}
            value={formData.mensaje}
            onChange={handleChange}
            placeholder={lang === "es" ? text.mensajeEs : text.mensajeEn}
            className="mt-1 w-full rounded-md border border-[var(--background-alt)] bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label
            htmlFor="cancionSi"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            {lang === "es" ? text.cancionEs : text.cancionEn}
          </label>

          <input
            id="cancionSi"
            name="cancionSi"
            type="text"
            value={formData.cancionSi}
            onChange={handleChange}
            placeholder={
              lang === "es"
                ? "Nombre de la canción y artista"
                : "Song title and artist"
            }
            className="mt-1 w-full rounded-md border border-[var(--background-alt)] bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-[var(--accent)] py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-dark)]"
        >
          {lang === "es" ? text.enviarEs : text.enviarEn}
        </button>
      </form>
    </div>
  );
}