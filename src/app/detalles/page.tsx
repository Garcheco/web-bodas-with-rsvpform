import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import MapEmbed from "@/components/MapEmbed";

export default function DetallesPage() {
  return (
    <>
      <Header />
      <main>
        <Section
          id="detalles"
          titleEs="Detalles del evento"
          titleEn="Event details"
          subtitleEs="Información sobre la recepción."
          subtitleEn="Information about the reception."
          variant="alt"
        >
          <div className="mx-auto max-w-3xl">
            <MapEmbed
              titleEs="Ubicación del evento"
              titleEn="Event location"
              addressEs="DoubleTree By Hilton, Av Camarón Sábalo 905, Zona Costera, Mazatlán, Sinaloa"
              addressEn="DoubleTree By Hilton, 905 Camarón Sábalo Avenue, Mazatlán, Sinaloa"
              embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1559.136489624192!2d-106.4582081726065!3d23.25475121193651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x869f54b1527cb4d7%3A0x16e2559552702624!2sDoubleTree%20By%20Hilton%20Mazatl%C3%A1n!5e0!3m2!1ses-419!2smx!4v1788154474418!5m2!1ses-419!2smx"
              lang="es"
            />
          </div>

          <div className="mt-12 text-center">
            <h4 className="text-lg font-serif font-semibold text-[var(--foreground)]">
              Hora de la recepción
            </h4>
            <p className="mt-1 text-[var(--foreground-muted)]">
              Sábado 10 de abril de 2027 — 19:00 hrs
            </p>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-[var(--foreground-muted)]">
              Dress code: formal de playa
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}