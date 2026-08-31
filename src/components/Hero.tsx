import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background overlay mas suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/20" />

      {/* Background image (playa / atardecer) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-semibold tracking-tight">
          Cecilia &amp; Edgard
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-white/90 font-sans">
          Nos casamos en Mazatlán, Sinaloa
        </p>

        <p className="mt-1 text-base sm:text-lg text-white/80 font-sans">
          Sábado 10 de abril de 2027
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/rsvp"
            className="px-6 py-3 rounded-full bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-dark)] transition"
          >
            Confirmar asistencia
          </Link>
          <Link
            href="/detalles"
            className="px-6 py-3 rounded-full border border-white/70 text-white font-medium hover:bg-white/10 transition"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </section>
  );
}