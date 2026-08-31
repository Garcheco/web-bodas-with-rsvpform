import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Section from "@/components/Section";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        <Section
          id="intro"
          titleEs="Nuestra boda"
          titleEn="Our wedding"
          subtitleEs="Te invitamos a celebrar con nosotros este dia tan especial en Mazatlán, Sinaloa."
          subtitleEn="We invite you to celebrate with us this special day in Mazatlán, Sinaloa."
          variant="alt"
        >
          {/* Contenido más adelante: countdown, mapa mini, etc. */}
        </Section>
      </main>
      <Footer />
    </>
  );
}