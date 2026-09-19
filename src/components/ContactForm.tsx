"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FormData = {
  nombre: string;
  email: string;
  mensaje: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContactForm() {
  const router = useRouter();
  const [lang, setLang] = useState<"es" | "en">("es");
  const email = process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL;
  const ccEmail = process.env.NEXT_PUBLIC_FORMSUBMIT_CC_EMAIL;

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    mensaje: "",
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
      HTMLInputElement | HTMLTextAreaElement
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

    // Validar todos los campos requeridos
    if (!formData.nombre.trim()) {
      newErrors.nombre = lang === "es" ? "Nombre requerido" : "Name required";
    }

    if (!formData.email.trim()) {
      newErrors.email = lang === "es" ? "Correo requerido" : "Email required";
    } else {
      const emailError = validateField("email", formData.email);
      if (emailError) {
        newErrors.email = emailError;
      }
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = lang === "es" ? "Mensaje requerido" : "Message required";
    } else {
      const mensajeError = validateField("mensaje", formData.mensaje);
      if (mensajeError) {
        newErrors.mensaje = mensajeError;
      }
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
        mensaje: "",
      });
      setErrors({});

      // NO redirigir, solo mostrar el banner de éxito
      // El usuario puede seguir navegando en la página
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const text = {
    titleEs: "Envíanos un mensaje",
    titleEn: "Send us a message",

    nombreEs: "Nombre",
    nombreEn: "Name",

    emailEs: "Correo electrónico",
    emailEn: "Email",

    mensajeEs: "Mensaje",
    mensajeEn: "Message",

    enviarEs: "Enviar mensaje",
    enviarEn: "Send message",

    sendingEs: "Enviando...",
    sendingEn: "Sending...",

    successEs: "¡Mensaje enviado con éxito!",
    successEn: "Message sent successfully!",

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

      {/* Mensaje de éxito */}
      {submitStatus === "success" && (
        <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200 flex items-start justify-between gap-4">
          <p className="text-sm text-green-800">
            {lang === "es" ? text.successEs : text.successEn}
          </p>
          <button
            type="button"
            onClick={() => setSubmitStatus("idle")}
            className="text-green-600 hover:text-green-800 flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Mensaje de error */}
      {submitStatus === "error" && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 flex items-start justify-between gap-4">
          <p className="text-sm text-red-800">
            {lang === "es" ? text.errorEs : text.errorEn}
          </p>
          <button
            type="button"
            onClick={() => setSubmitStatus("idle")}
            className="text-red-600 hover:text-red-800 flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <input type="hidden" name="_subject" value="Mensaje de contacto de la web de la boda" />
        <input type="hidden" name="_captcha" value="false" />
        {ccEmail && <input type="hidden" name="_cc" value={ccEmail} />}

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
            className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-1 ${
              errors.nombre
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-[var(--background-alt)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
            }`}
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
          )}
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
            rows={4}
            required
            value={formData.mensaje}
            onChange={handleChange}
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