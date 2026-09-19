import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import Link from "next/link";

const hoteles = [
  {
    nombre: "Holiday Inn Resort Mazatlán",
    descripcion: "Frente al mar, ideal para familias",
    precio: "$2,500 - $4,000 MXN/noche",
    imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    link: "https://www.ihg.com/holidayinnresorts/hotels/us/es/mazatlan/mztrs/hoteldetail",
  },
  {
    nombre: "Pueblo Amigo Plaza & Conference Center",
    descripcion: "Céntrico y moderno",
    precio: "$1,800 - $3,200 MXN/noche",
    imagen: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    link: "#",
  },
  {
    nombre: "Casa Lucía Hotel Boutique",
    descripcion: "Encanto colonial en el centro histórico",
    precio: "$1,500 - $2,800 MXN/noche",
    imagen: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    link: "#",
  },
];

export default function HospedajePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero de Hospedaje */}
        <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')",
            }}
            aria-hidden
          />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold">
              Hospedaje
            </h1>
            <p className="mt-3 text-lg text-white/90">
              Tu estadía en Mazatlán
            </p>
          </div>
        </section>

        {/* Información general */}
        <Section
          id="info"
          titleEs="Recomendaciones de hospedaje"
          titleEn="Accommodation recommendations"
          subtitleEs="Hemos seleccionado algunos hoteles cercanos para tu comodidad"
          subtitleEn="We've selected some nearby hotels for your convenience"
        >
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[var(--foreground-muted)] leading-relaxed mb-6">
              Mazatlán ofrece una gran variedad de opciones de hospedaje para todos 
              los gustos y presupuestos. Hemos seleccionado algunos hoteles que están 
              cerca de la ubicación de la boda y que ofrecen excelentes servicios.
            </p>
            <p className="text-[var(--foreground-muted)] leading-relaxed mb-6">
              Te recomendamos reservar con anticipación, especialmente si planeas 
              quedarte varios días. Muchos de estos hoteles ofrecen tarifas especiales 
              para bodas, así que no olvides mencionar que vienes a la boda de 
              Cecilia & Edgard.
            </p>
            <div className="bg-[var(--background-alt)] rounded-lg p-6 mt-8">
              <h3 className="text-xl font-serif font-semibold mb-4">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                Si tienes alguna pregunta o necesitas ayuda con las reservaciones, 
                no dudes en contactarnos.
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

        {/* Lista de hoteles */}
        <Section
          id="hoteles"
          titleEs="Hoteles recomendados"
          titleEn="Recommended hotels"
          subtitleEs="Opciones para todos los gustos"
          subtitleEn="Options for all tastes"
          variant="alt"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {hoteles.map((hotel, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
              >
                <div className="aspect-video relative">
                  <Image
                    src={hotel.imagen}
                    alt={hotel.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold mb-2">
                    {hotel.nombre}
                  </h3>
                  <p className="text-[var(--foreground-muted)] text-sm mb-3">
                    {hotel.descripcion}
                  </p>
                  <p className="text-[var(--accent)] font-semibold mb-4">
                    {hotel.precio}
                  </p>
                  <a
                    href={hotel.link}
                    className="block w-full text-center px-4 py-2 border border-[var(--accent)] text-[var(--accent)] rounded-full font-medium hover:bg-[var(--accent)] hover:text-white transition"
                  >
                    Ver más
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Mapa */}
        <Section
          id="mapa"
          titleEs="Ubicación"
          titleEn="Location"
          subtitleEs="Zona hotelera de Mazatlán"
          subtitleEn="Mazatlán hotel zone"
        >
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.066669158299!2d-106.4291!3d23.2494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86a0866d646d0a4b%3A0x6b5b5b5b5b5b5b5b!2sMazatl%C3%A1n%2C%20Sin.!5e0!3m2!1ses!2smx!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}