import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--background-alt)] bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-serif text-lg text-[var(--foreground)]">
              Boda Cecilia & Edgard
            </p>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">
              Mazatlán, Sinaloa &mdash; 2027
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/rsvp"
              className="px-4 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-dark)] transition"
            >
              Confirmar asistencia
            </Link>
          </div>

          <p className="text-xs text-[var(--foreground-muted)]">
            Hecho con amor y un toque de la Fuerza.
          </p>
        </div>
      </div>
    </footer>
  );
}