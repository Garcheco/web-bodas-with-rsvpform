"use client";

import { useRouter } from "next/navigation";
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

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function RsvpForm() {
  const router = useRouter();
  const [lang, setLang] = useState<"es" | "en">("es");
  const email = process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL;
  const ccEmail = process.env.NEXT_PUBLIC_FORMSUBMIT_CC_EMAIL;

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    whatsapp: "",
    asistencia: "",
    invitados: "",
    mensaje: "",
    cancionSi: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return lang === "es"
            ? "Ingresa un correo electrónico válido"
            : "Please enter a valid email address";
        }
        break;
      case "whatsapp":
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        const cleanedValue = value.replace(/[\s\-\(\)]/g, "");
        if (!phoneRegex.test(cleanedValue)) {
          return lang === "es"
            ? "Ingresa un número de WhatsApp válido (con código de país)"
            : "Please enter a valid WhatsApp number (with country code)";
        }
        break;
      case "invitados":
        const numInvitados = parseInt(value, 10);
        if (isNaN(numInvitados) || numInvitados < 1) {
          return lang === "es"
            ? "Mínimo 1 invitado"
            : "Minimum 1 guest";
        }
        if (numInvitados > 10) {
          return lang === "es"
            ? "Máximo 10 invitados"
            : "Maximum 10 guests";
        }
        break;
      case "mensaje":
        if (value.length > 500) {
          return lang === "es"
            ? "El mensaje no puede exceder 500 caracteres"
            : "Message cannot exceed 500 characters";
        }
        break;
    }
    return undefined;
  };

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

    // Validar campo individualmente
    const error = validateField(name as keyof FormData, value);
    setErrors((previous) => ({
      ...previous,
      [name]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar todos los campos
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    // Validar asistencia
    if (!formData.asistencia) {
      newErrors.asistencia = lang === "es"
        ? "Selecciona una opción"
        : "Please select an option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formElement = event.currentTarget;
      const formDataObj = new FormData(formElement);

      // Eliminar _next del FormData si existe
      formDataObj.delete("_next");

      const params = new URLSearchParams();
      formDataObj.forEach((value, key) => {
        params.append(key, String(value));
      });

      const response = await fetch(`https://formsubmit.co/${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error("Error al enviar");
      }

      setSubmitStatus("success");
      setFormData({
        nombre: "",
        email: "",
        whatsapp: "",
        asistencia: "",
        invitados: "",
        mensaje: "",
        cancionSi: "",
      });
      setErrors({});

      // Redirigir manualmente después de 2 segundos
      setTimeout(() => {
        router.push("/rsvp/gracias");
      }, 2000);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
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

    sendingEs: "Enviando...",
    sendingEn: "Sending...",

    successEs: "¡Confirmación enviada con éxito!",
    successEn: "Confirmation sent successfully!",

    errorEs: "Error al enviar. Por favor intenta de nuevo.",
    errorEn: "Error sending. Please try again.",
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

      {/* Mensaje de éxito */}
      {submitStatus === "success" && (
        <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm text-green-800">
            {lang === "es" ? text.successEs : text.successEn}
          </p>
        </div>
      )}

      {/* Mensaje de error */}
      {submitStatus === "error" && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">
            {lang === "es" ? text.errorEs : text.errorEn}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <input
          type="hidden"
          name="_subject"
          value="Nueva confirmación RSVP - Boda C&E"
        />

        {/* Se comenta la redirección automática para que el usuario vea el mensaje de éxito o error en la misma página */}
        {/*<input
          type="hidden"
          name="_next"
          value={`${siteUrl}/rsvp/gracias`}
        />*/}

        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_cc" value={ccEmail} />

        {/* Nombre */}
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

        {/* Email */}
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
            className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-1 ${
              errors.email
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-[var(--background-alt)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* WhatsApp */}
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
            className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-1 ${
              errors.whatsapp
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-[var(--background-alt)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
            }`}
          />
          {errors.whatsapp && (
            <p className="mt-1 text-xs text-red-600">{errors.whatsapp}</p>
          )}
        </div>

        {/* Asistencia */}
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
            className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 ${
              errors.asistencia
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-[var(--background-alt)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
            }`}
          >
            <option value="">
              {lang === "es" ? text.seleccionaEs : text.seleccionaEn}
            </option>

            <option value="Sí">{lang === "es" ? text.siEs : text.siEn}</option>

            <option value="No">{lang === "es" ? text.noEs : text.noEn}</option>
          </select>
          {errors.asistencia && (
            <p className="mt-1 text-xs text-red-600">{errors.asistencia}</p>
          )}
        </div>

        {/* Invitados */}
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
            max="10"
            required
            value={formData.invitados}
            onChange={handleChange}
            placeholder="1"
            className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-1 ${
              errors.invitados
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-[var(--background-alt)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
            }`}
          />
          {errors.invitados && (
            <p className="mt-1 text-xs text-red-600">{errors.invitados}</p>
          )}
        </div>

        {/* Mensaje */}
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
            className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-1 ${
              errors.mensaje
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-[var(--background-alt)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
            }`}
          />
          {errors.mensaje && (
            <p className="mt-1 text-xs text-red-600">{errors.mensaje}</p>
          )}
        </div>

        {/* Canción */}
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

        {/* Botón de enviar */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded-full py-3 text-sm font-medium text-white transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[var(--accent)] hover:bg-[var(--accent-dark)]"
          }`}
        >
          {isSubmitting
            ? lang === "es"
              ? text.sendingEs
              : text.sendingEn
            : lang === "es"
            ? text.enviarEs
            : text.enviarEn}
        </button>
      </form>
    </div>
  );
}