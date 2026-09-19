import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";

export default function HistoriaPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero de Historia */}
        <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1615966650071-855b15f29ad1?fm=jpg&q=60&w=3000&auto=format&fit=crop')",
            }}
            aria-hidden
          />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold">
              Nuestra Historia
            </h1>
            <p className="mt-3 text-lg text-white/90">
              Cómo comenzó todo
            </p>
          </div>
        </section>

        {/* Sección 1: Cómo nos conocimos */}
        <Section
          id="como-nos-conocimos"
          titleEs="Cómo nos conocimos"
          titleEn="How we met"
          subtitleEs="Todo comenzó en una tarde cualquiera..."
          subtitleEn="It all started on an ordinary afternoon..."
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <p className="text-[var(--foreground-muted)] leading-relaxed mb-4">
                Fue en el año 2018 cuando nuestros caminos se cruzaron por primera vez. 
                Edgard había llegado recientemente a la ciudad y Cecilia trabajaba en 
                el mismo edificio. Una coincidencia del destino hizo que se encontraran 
                en el elevador un lunes por la mañana.
              </p>
              <p className="text-[var(--foreground-muted)] leading-relaxed mb-4">
                Lo que comenzó como una conversación casual sobre el tráfico y el café 
                del lobby, se convirtió en una charla que duró más de lo esperado. 
                Desde ese día, algo cambió.
              </p>
              <p className="text-[var(--foreground-muted)] leading-relaxed">
                Las conversaciones se hicieron más frecuentes, las salidas también, y 
                sin darnos cuenta, nos dimos cuenta de que habíamos encontrado en el 
                otro a nuestra persona favorita.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src="https://instagram.fgdl10-1.fna.fbcdn.net/v/t51.82787-15/573235089_18545457025046131_7163694866786485674_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1ODgwMjI2MTQwNjM1ODAwNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=X7dHmjJsPtkQ7kNvwHYV-Tb&_nc_oc=AdoAACfIUXLSR1vT28frXZcKAB3-z1lm5IiJHSL04MPVYdSu3ZbvNLDOpn4WbH1IA0M&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fgdl10-1.fna&_nc_gid=dZR3qUtDIbqz5aC1KrHHbA&_nc_ss=7a22e&oh=00_AQIbBwvQCvnxRHJfqLygJWVzlsR5A6aqYFiM5MNSpP-wSw&oe=6AB3CDCF"
                  alt="Foto de cuando nos conocimos"
                  width={1200}
                  height={1200}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Sección 2: Nuestra relación */}
        <Section
          id="nuestra-relacion"
          titleEs="Nuestra relación"
          titleEn="Our relationship"
          subtitleEs="Aventuras, viajes y momentos inolvidables"
          subtitleEn="Adventures, trips and unforgettable moments"
          variant="alt"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1700353612860-bd8ab8d71f05?q=80&w=870&auto=format&fit=crop"
                  alt="Foto de viaje"
                  width={870}
                  height={870}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-[var(--foreground-muted)] leading-relaxed mb-4">
                Durante estos años hemos compartido incontables aventuras. Desde viajes 
                espontáneos a la playa, hasta cenas románticas en casa viendo películas. 
                Cada momento juntos ha sido especial a su manera.
              </p>
              <p className="text-[var(--foreground-muted)] leading-relaxed mb-4">
                Aprendimos a conocernos, a apoyarnos en los momentos difíciles y a 
                celebrar juntos los logros. Crecimos individualmente, pero siempre 
                como equipo.
              </p>
              <p className="text-[var(--foreground-muted)] leading-relaxed">
                Y aunque hemos pasado por retos, siempre supimos que estábamos 
                construyendo algo único y verdadero.
              </p>
            </div>
          </div>
        </Section>

        {/* Sección 3: La propuesta */}
        <Section
          id="propuesta"
          titleEs="¡Sí, acepto!"
          titleEn="Yes, I do!"
          subtitleEs="El día que cambió nuestras vidas"
          subtitleEn="The day that changed our lives"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <p className="text-[var(--foreground-muted)] leading-relaxed mb-4">
                Después de 5 años juntos, Edgard sabía que quería pasar el resto de 
                su vida con Cecilia. Así que comenzó a planear la propuesta perfecta.
              </p>
              <p className="text-[var(--foreground-muted)] leading-relaxed mb-4">
                Fue en una tarde de diciembre, durante un paseo por la playa al 
                atardecer. El cielo estaba pintado de naranja y rosa, y el sonido 
                de las olas creaba el ambiente perfecto.
              </p>
              <p className="text-[var(--foreground-muted)] leading-relaxed">
                Cuando llegaron a un punto tranquilo de la playa, Edgard se detuvo, 
                tomó las manos de Cecilia y, con la voz entrecortada por la emoción, 
                le preguntó si quería pasar el resto de su vida juntos. Entre lágrimas 
                de felicidad, la respuesta fue un rotundo ¡SÍ!
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1700353612860-bd8ab8d71f05?q=80&w=870&auto=format&fit=crop"
                  alt="Foto de la propuesta"
                  width={870}
                  height={870}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Sección 4: El futuro */}
        <Section
          id="futuro"
          titleEs="Nuestro futuro"
          titleEn="Our future"
          subtitleEs="Empezando una nueva aventura juntos"
          subtitleEn="Starting a new adventure together"
          variant="alt"
        >
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[var(--foreground-muted)] leading-relaxed mb-6 text-lg">
              Ahora estamos listos para dar el siguiente paso en nuestra historia. 
              Queremos construir un hogar lleno de amor, risas y aventuras. Soñamos 
              con viajar juntos, crear nuevas tradiciones y seguir creciendo como pareja.
            </p>
            <p className="text-[var(--foreground-muted)] leading-relaxed text-lg">
              Este matrimonio no es el final de nuestro amor, sino el comienzo de 
              una nueva etapa. Y no podríamos estar más emocionados de compartirla 
              contigo.
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}