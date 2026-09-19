import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import Link from "next/link";

export default function RegalosPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero de Regalos */}
        <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1974&auto=format&fit=crop')",
            }}
            aria-hidden
          />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold">
              Regalos
            </h1>
            <p className="mt-3 text-lg text-white/90">
              Tu presencia es nuestro mejor regalo
            </p>
          </div>
        </section>

        {/* Mensaje principal */}
        <Section
          id="mensaje"
          titleEs="Mesa de regalos"
          titleEn="Gift registry"
          subtitleEs="Tu presencia es el mejor regalo, pero si deseas tener un detalle con nosotros..."
          subtitleEn="Your presence is the best gift, but if you wish to give us something..."
        >
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[var(--foreground-muted)] leading-relaxed mb-6 text-lg">
              Después de pensarlo mucho, hemos decidido que lo más importante para 
              nosotros es celebrar este día especial con las personas que más amamos.
            </p>
            <p className="text-[var(--foreground-muted)] leading-relaxed mb-6 text-lg">
              Sin embargo, sabemos que muchos de ustedes han preguntado sobre regalos, 
              así que hemos creado esta página con algunas opciones por si desean 
              tener un detalle con nosotros.
            </p>
            <div className="bg-[var(--background-alt)] rounded-lg p-8 mt-8">
              <p className="text-[var(--foreground)] font-medium text-lg mb-4">
                ¡Tu presencia en nuestra boda es el mejor regalo que podríamos recibir!
              </p>
              <p className="text-[var(--foreground-muted)]">
                Lo más importante para nosotros es compartir este día tan especial contigo.
              </p>
            </div>
          </div>
        </Section>

        {/* Opciones de regalos */}
        <Section
          id="opciones"
          titleEs="Opciones de regalos"
          titleEn="Gift options"
          subtitleEs="Algunas ideas por si deseas tener un detalle"
          subtitleEn="Some ideas if you wish to give us something"
          variant="alt"
        >
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Opción 1: Sobre */}
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[var(--accent)]"
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
              <h3 className="text-2xl font-serif font-semibold mb-4">
                Sobre
              </h3>
              <p className="text-[var(--foreground-muted)] mb-6">
                Si prefieres darnos un regalo en efectivo, puedes hacerlo en un 
                sobre el día de la boda. Nos ayudará para nuestro viaje de luna 
                de miel.
              </p>
              <div className="text-sm text-[var(--foreground-muted)]">
                <p>Disponible en la recepción</p>
              </div>
            </div>

            {/* Opción 2: Transferencia */}
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[var(--accent)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-semibold mb-4">
                Transferencia
              </h3>
              <p className="text-[var(--foreground-muted)] mb-6">
                Si prefieres hacer una transferencia, contáctanos y te compartiremos 
                los datos bancarios.
              </p>
              <Link
                href="/contacto"
                className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-full font-medium hover:bg-[var(--accent-dark)] transition"
              >
                Contactar
              </Link>
            </div>
          </div>
        </Section>

        {/* Mensaje final */}
        <Section
          id="agradecimiento"
          titleEs="Gracias"
          titleEn="Thank you"
          subtitleEs="De todo corazón, gracias por ser parte de nuestra vida"
          subtitleEn="From the bottom of our hearts, thank you for being part of our lives"
        >
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[var(--foreground-muted)] leading-relaxed text-lg">
              Estamos muy emocionados de celebrar este día tan especial con ustedes. 
              Su amor y apoyo han significado mucho para nosotros en este camino.
            </p>
            <p className="text-[var(--foreground-muted)] leading-relaxed text-lg mt-6">
              ¡Nos vemos en la boda!
            </p>
            <p className="text-[var(--foreground)] font-serif text-2xl mt-8">
              Cecilia & Edgard
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}