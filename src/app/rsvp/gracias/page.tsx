import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import Link from "next/link";

export default function GraciasPage() {
  return (
    <>
      <Header />
      <main>
        <Section
          id="gracias"
          titleEs="¡Gracias!"
          titleEn="Thank you!"
          subtitleEs="Tu confirmación ha sido enviada correctamente."
          subtitleEn="Your confirmation has been sent successfully."
          variant="alt"
        >
          <div className="text-center">
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto">
              Nos vemos pronto en Mazatlán. Si tienes alguna duda, puedes
              contactarnos en la página de Contacto.
            </p>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto mt-2">
              See you soon in Mazatlán. If you have any questions, you can
              contact us on the Contact page.
            </p>

            <div className="mt-8">
              <Link
                href="/"
                className="inline-block rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--accent-dark)] transition"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}