"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", labelEs: "Inicio", labelEn: "Home" },
  { href: "/historia", labelEs: "Historia", labelEn: "Story" },
  { href: "/detalles", labelEs: "Detalles", labelEn: "Details" },
  { href: "/rsvp", labelEs: "RSVP", labelEn: "RSVP" },
  { href: "/regalos", labelEs: "Regalos", labelEn: "Gifts" },
  { href: "/hospedaje", labelEs: "Hospedaje", labelEn: "Stay" },
  {
    labelEs: "Galería",
    labelEn: "Gallery",
    children: [
      { href: "/galeria", labelEs: "Fotos", labelEn: "Photos" },
      { href: "/galeria-instagram", labelEs: "Instagram", labelEn: "Instagram" },
    ],
  },
  { href: "/contacto", labelEs: "Contacto", labelEn: "Contact" },
];

export default function Header() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const toggleLang = () => setLang((l) => (l === "es" ? "en" : "es"));

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/90 backdrop-blur border-b border-[var(--background-alt)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-serif font-semibold tracking-wide text-[var(--foreground)]"
          >
            Boda Cecilia & Edgard
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              if ("children" in item) {
                return (
                  <div
                    key={item.labelEs}
                    className="relative"
                    onMouseEnter={() => setGalleryOpen(true)}
                    onMouseLeave={() => setGalleryOpen(false)}
                  >
                    {/* Botón + Área invisible hacia el dropdown */}
                    <div className="flex items-center gap-1">
                      <button
                        className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition flex items-center gap-1 py-2"
                        aria-haspopup="true"
                        aria-expanded={galleryOpen}
                      >
                        {lang === "es" ? item.labelEs : item.labelEn}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Dropdown */}
                    {galleryOpen && (
                      <>
                        {/* Puente invisible para que no se cierre al bajar */}
                        <div className="absolute left-0 top-full h-2 w-full" />
                        <div className="absolute left-0 mt-2 w-40 rounded-md bg-white shadow-lg border border-[var(--background-alt)] overflow-hidden z-50">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] hover:text-[var(--foreground)] transition"
                            >
                              {lang === "es" ? child.labelEs : child.labelEn}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition"
                >
                  {lang === "es" ? item.labelEs : item.labelEn}
                </Link>
              );
            })}
            <Link
              href="/rsvp"
              className="ml-2 px-4 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-dark)] transition"
            >
              {lang === "es" ? "Confirmar" : "RSVP"}
            </Link>
            <button
              onClick={toggleLang}
              className="text-xs px-2 py-1 rounded border border-[var(--background-alt)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)] transition"
              aria-label="Switch language"
            >
              {lang === "es" ? "EN" : "ES"}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/rsvp"
              className="px-3 py-1.5 rounded-full bg-[var(--accent)] text-white text-xs font-medium hover:bg-[var(--accent-dark)] transition"
            >
              {lang === "es" ? "Confirmar" : "RSVP"}
            </Link>
            <button
              onClick={toggleLang}
              className="text-xs px-2 py-1 rounded border border-[var(--background-alt)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)] transition"
              aria-label="Switch language"
            >
              {lang === "es" ? "EN" : "ES"}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="text-[var(--foreground)]"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-2">
            {navItems.map((item) => {
              if ("children" in item) {
                return (
                  <div key={item.labelEs} className="pl-2 border-l border-[var(--background-alt)]">
                    <p className="text-sm font-medium text-[var(--foreground)] mb-1">
                      {lang === "es" ? item.labelEs : item.labelEn}
                    </p>
                    <div className="flex flex-col gap-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition py-1"
                        >
                          {lang === "es" ? child.labelEs : child.labelEn}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition py-1"
                >
                  {lang === "es" ? item.labelEs : item.labelEn}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}