import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero de Contacto */}
        <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop')",
            }}
            aria-hidden
          />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold">
              Contacto
            </h1>
            <p className="mt-3 text-lg text-white/90">
              Estamos aquí para ayudarte
            </p>
          </div>
        </section>

        {/* Información de contacto */}
        <Section
          id="info"
          titleEs="Contáctanos"
          titleEn="Contact us"
          subtitleEs="¿Tienes alguna pregunta? Estamos aquí para ayudarte"
          subtitleEn="Any questions? We're here to help"
        >
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Información */}
            <div>
              <h3 className="text-2xl font-serif font-semibold mb-6">
                Información de contacto
              </h3>
              <p className="text-[var(--foreground-muted)] leading-relaxed mb-8">
                Si tienes alguna duda sobre la boda, el hospedaje, o cualquier otra 
                cosa, no dudes en contactarnos. Estaremos encantados de ayudarte.
              </p>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-[var(--accent)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Correo electrónico</h4>
                    <a
                      href="mailto:sevcho11@gmail.com"
                      className="text-[var(--accent)] hover:underline"
                    >
                      sevcho11@gmail.com
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-[var(--accent)]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                    />
                  </svg>
                </div>
                  <div>
                    <h4 className="font-semibold mb-1">WhatsApp</h4>
                    <a
                      href="https://wa.me/526691234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:underline"
                    >
                      +52 669 123 4567
                    </a>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-[var(--accent)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Ubicación</h4>
                    <p className="text-[var(--foreground-muted)]">
                      Mazatlán, Sinaloa, México
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de contacto */}
            <div>
              <ContactForm />
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section
          id="faq"
          titleEs="Preguntas frecuentes"
          titleEn="Frequently asked questions"
          subtitleEs="Respuestas a las preguntas más comunes"
          subtitleEn="Answers to the most common questions"
          variant="alt"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold mb-2">¿Cuál es el código de vestimenta?</h4>
              <p className="text-[var(--foreground-muted)]">
                El código de vestimenta es formal. Para ellos traje o esmoquin, y 
                para ellas vestido de gala o traje sastre.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold mb-2">¿Puedo llevar niños?</h4>
              <p className="text-[var(--foreground-muted)]">
                La boda es solo para adultos. Agradecemos si pueden coordinar una 
                niñera para los más pequeños.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold mb-2">¿Habrá parqueadero?</h4>
              <p className="text-[var(--foreground-muted)]">
                Sí, el lugar cuenta con parqueadero gratuito para todos los invitados.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold mb-2">¿Puedo confirmar después de la fecha límite?</h4>
              <p className="text-[var(--foreground-muted)]">
                Te pedimos confirmar antes de la fecha indicada para poder organizar 
                todo adecuadamente. Si tienes un inconveniente, contáctanos.
              </p>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}