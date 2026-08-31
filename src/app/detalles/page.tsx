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
          subtitleEs="Información sobre la ceremonia y la recepción."
          subtitleEn="Information about the ceremony and reception."
          variant="alt"
        >
          <div className="grid md:grid-cols-2 gap-10">
            <MapEmbed
              titleEs="Ceremonia"
              titleEn="Ceremony"
              addressEs="Parroquia de Mazatlán, Centro, Mazatlán, Sinaloa"
              addressEn="Mazatlán Parish, Centro, Mazatlán, Sinaloa"
              embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3696.5!2d-106.42!3d23.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zMjPCsDE1JzAwLjAiTiAxMDbCsDI1JzEyLjAiVw!5e0!3m1!1s0x0:0x0!2m3!1f0!2f0!3f0"
              lang="es"
            />
            <MapEmbed
              titleEs="Recepción"
              titleEn="Reception"
              addressEs="Salón de eventos, Zona Dorada, Mazatlán, Sinaloa"
              addressEn="Event hall, Golden Zone, Mazatlán, Sinaloa"
              embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3696.5!2d-106.42!3d23.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zMjPCsDE1JzAwLjAiTiAxMDbCsDI1JzEyLjAiVw!5e0!3m1!1s0x0:0x0!2m3!1f0!2f0!3f0"
              lang="es"
            />
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8 text-center md:text-left">
            <div>
              <h4 className="text-lg font-serif font-semibold text-[var(--foreground)]">
                Hora de la ceremonia
              </h4>
              <p className="mt-1 text-[var(--foreground-muted)]">
                Sábado 10 de abril de 2027 — 17:00 hrs
              </p>
            </div>
            <div>
              <h4 className="text-lg font-serif font-semibold text-[var(--foreground)]">
                Hora de la recepción
              </h4>
              <p className="mt-1 text-[var(--foreground-muted)]">
                Sábado 10 de abril de 2027 — 19:00 hrs
              </p>
            </div>
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