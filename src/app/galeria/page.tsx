import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";

const photos = [
  {
    src: "https://instagram.fgdl10-1.fna.fbcdn.net/v/t51.82787-15/573235089_18545457025046131_7163694866786485674_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1ODgwMjI2MTQwNjM1ODAwNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=X7dHmjJsPtkQ7kNvwHYV-Tb&_nc_oc=AdoAACfIUXLSR1vT28frXZcKAB3-z1lm5IiJHSL04MPVYdSu3ZbvNLDOpn4WbH1IA0M&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fgdl10-1.fna&_nc_gid=dZR3qUtDIbqz5aC1KrHHbA&_nc_ss=7a22e&oh=00_AQIbBwvQCvnxRHJfqLygJWVzlsR5A6aqYFiM5MNSpP-wSw&oe=6AB3CDCF",
    alt: "Foto 1",
  },
  {
    src: "https://instagram.fgdl10-1.fna.fbcdn.net/v/t51.82787-15/573235089_18545457025046131_7163694866786485674_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1ODgwMjI2MTQwNjM1ODAwNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=X7dHmjJsPtkQ7kNvwHYV-Tb&_nc_oc=AdoAACfIUXLSR1vT28frXZcKAB3-z1lm5IiJHSL04MPVYdSu3ZbvNLDOpn4WbH1IA0M&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fgdl10-1.fna&_nc_gid=dZR3qUtDIbqz5aC1KrHHbA&_nc_ss=7a22e&oh=00_AQIbBwvQCvnxRHJfqLygJWVzlsR5A6aqYFiM5MNSpP-wSw&oe=6AB3CDCF",
    alt: "Foto 2",
  },
  {
    src: "https://instagram.fgdl10-1.fna.fbcdn.net/v/t51.82787-15/573235089_18545457025046131_7163694866786485674_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1ODgwMjI2MTQwNjM1ODAwNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=X7dHmjJsPtkQ7kNvwHYV-Tb&_nc_oc=AdoAACfIUXLSR1vT28frXZcKAB3-z1lm5IiJHSL04MPVYdSu3ZbvNLDOpn4WbH1IA0M&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fgdl10-1.fna&_nc_gid=dZR3qUtDIbqz5aC1KrHHbA&_nc_ss=7a22e&oh=00_AQIbBwvQCvnxRHJfqLygJWVzlsR5A6aqYFiM5MNSpP-wSw&oe=6AB3CDCF",
    alt: "Foto 3",
  },
  {
    src: "https://instagram.fgdl10-1.fna.fbcdn.net/v/t51.82787-15/573235089_18545457025046131_7163694866786485674_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1ODgwMjI2MTQwNjM1ODAwNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=X7dHmjJsPtkQ7kNvwHYV-Tb&_nc_oc=AdoAACfIUXLSR1vT28frXZcKAB3-z1lm5IiJHSL04MPVYdSu3ZbvNLDOpn4WbH1IA0M&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fgdl10-1.fna&_nc_gid=dZR3qUtDIbqz5aC1KrHHbA&_nc_ss=7a22e&oh=00_AQIbBwvQCvnxRHJfqLygJWVzlsR5A6aqYFiM5MNSpP-wSw&oe=6AB3CDCF",
    alt: "Foto 4",
  },
  {
    src: "https://instagram.fgdl10-1.fna.fbcdn.net/v/t51.82787-15/573235089_18545457025046131_7163694866786485674_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1ODgwMjI2MTQwNjM1ODAwNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=X7dHmjJsPtkQ7kNvwHYV-Tb&_nc_oc=AdoAACfIUXLSR1vT28frXZcKAB3-z1lm5IiJHSL04MPVYdSu3ZbvNLDOpn4WbH1IA0M&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fgdl10-1.fna&_nc_gid=dZR3qUtDIbqz5aC1KrHHbA&_nc_ss=7a22e&oh=00_AQIbBwvQCvnxRHJfqLygJWVzlsR5A6aqYFiM5MNSpP-wSw&oe=6AB3CDCF",
    alt: "Foto 5",
  },
  {
    src: "https://instagram.fgdl10-1.fna.fbcdn.net/v/t51.82787-15/573235089_18545457025046131_7163694866786485674_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1ODgwMjI2MTQwNjM1ODAwNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=X7dHmjJsPtkQ7kNvwHYV-Tb&_nc_oc=AdoAACfIUXLSR1vT28frXZcKAB3-z1lm5IiJHSL04MPVYdSu3ZbvNLDOpn4WbH1IA0M&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fgdl10-1.fna&_nc_gid=dZR3qUtDIbqz5aC1KrHHbA&_nc_ss=7a22e&oh=00_AQIbBwvQCvnxRHJfqLygJWVzlsR5A6aqYFiM5MNSpP-wSw&oe=6AB3CDCF",
    alt: "Foto 6",
  },
  {
    src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1974&auto=format&fit=crop",
    alt: "Foto 7",
  },
  {
    src: "https://instagram.fgdl10-1.fna.fbcdn.net/v/t51.82787-15/573235089_18545457025046131_7163694866786485674_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1ODgwMjI2MTQwNjM1ODAwNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=X7dHmjJsPtkQ7kNvwHYV-Tb&_nc_oc=AdoAACfIUXLSR1vT28frXZcKAB3-z1lm5IiJHSL04MPVYdSu3ZbvNLDOpn4WbH1IA0M&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fgdl10-1.fna&_nc_gid=dZR3qUtDIbqz5aC1KrHHbA&_nc_ss=7a22e&oh=00_AQIbBwvQCvnxRHJfqLygJWVzlsR5A6aqYFiM5MNSpP-wSw&oe=6AB3CDCF",
    alt: "Foto 8",
  },
  {
    src: "https://instagram.fgdl10-1.fna.fbcdn.net/v/t51.82787-15/573235089_18545457025046131_7163694866786485674_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1ODgwMjI2MTQwNjM1ODAwNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5oZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=X7dHmjJsPtkQ7kNvwHYV-Tb&_nc_oc=AdoAACfIUXLSR1vT28frXZcKAB3-z1lm5IiJHSL04MPVYdSu3ZbvNLDOpn4WbH1IA0M&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fgdl10-1.fna&_nc_gid=dZR3qUtDIbqz5aC1KrHHbA&_nc_ss=7a22e&oh=00_AQIbBwvQCvnxRHJfqLygJWVzlsR5A6aqYFiM5MNSpP-wSw&oe=6AB3CDCF",
    alt: "Foto 9",
  },
];

export default function GaleriaPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero de Galería */}
        <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519741497674-6114818635a5?q=80&w=2070&auto=format&fit=crop')",
            }}
            aria-hidden
          />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold">
              Galería
            </h1>
            <p className="mt-3 text-lg text-white/90">
              Nuestros momentos especiales
            </p>
          </div>
        </section>

        {/* Galería de fotos */}
        <Section
          id="fotos"
          titleEs="Nuestras fotos"
          titleEn="Our photos"
          subtitleEs="Momentos que atesoramos para siempre"
          subtitleEn="Moments we cherish forever"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div
                key={`${photo.src}-${index}`}
                className="aspect-square rounded-lg overflow-hidden bg-gray-200 hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}