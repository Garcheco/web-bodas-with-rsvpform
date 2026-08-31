"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem =
  | { href: string; labelEs: string; labelEn: string }
  | {
      labelEs: string;
      labelEn: string;
      children: { href: string; labelEs: string; labelEn: string }[];
    };

const navItems: NavItem[] = [
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
              if ("children" in item && item.children) {
                return (
                  <div
                    key={item.labelEs}
                    className="relative"
                    onMouseEnter={() => setGalleryOpen(true)}
                    onMouseLeave={() => setGalleryOpen(false)}
                  >
                    <div className="flex items-center gap-1">
                      <button
                        className="flex items-center gap-1 py-2 text-sm text-[var(--foreground-muted)] transition hover:text-[var(--foreground)]"
                        aria-haspopup="true"
                        aria-expanded={galleryOpen}
                      >
                        {lang === "es" ? item.labelEs : item.labelEn}
                        <svg
                          className="h-4 w-4"
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

                    {galleryOpen && (
                      <>
                        <div className="absolute left-0 top-full h-2 w-full" />
                        <div className="absolute left-0 z-50 mt-2 w-40 overflow-hidden rounded-md border border-[var(--background-alt)] bg-white shadow-lg">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-[var(--foreground-muted)] transition hover:bg-[var(--background-alt)] hover:text-[var(--foreground)]"
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
                  className="text-sm text-[var(--foreground-muted)] transition hover:text-[var(--foreground)]"
                >
                  {lang === "es" ? item.labelEs : item.labelEn}
                </Link>
              );
            })}

            <Link
              href="/rsvp"
              className="ml-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--accent-dark)]"
            >
              {lang === "es" ? "Confirmar" : "RSVP"}
            </Link>
            <button
              onClick={toggleLang}
              className="rounded border border-[var(--background-alt)] px-2 py-1 text-xs text-[var(--foreground-muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              aria-label="Switch language"
            >
              {lang === "es" ? "EN" : "ES"}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/rsvp"
              className="rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[var(--accent-dark)]"
            >
              {lang === "es" ? "Confirmar" : "RSVP"}
            </Link>
            <button
              onClick={toggleLang}
              className="rounded border border-[var(--background-alt)] px-2 py-1 text-xs text-[var(--foreground-muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
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
                className="h-6 w-6"
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
          <nav className="flex flex-col gap-2 pb-4 md:hidden">
            {navItems.map((item) => {
              if ("children" in item && item.children) {
                return (
                  <div
                    key={item.labelEs}
                    className="border-l border-[var(--background-alt)] pl-2"
                  >
                    <p className="mb-1 text-sm font-medium text-[var(--foreground)]">
                      {lang === "es" ? item.labelEs : item.labelEn}
                    </p>
                    <div className="flex flex-col gap-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="py-1 text-sm text-[var(--foreground-muted)] transition hover:text-[var(--foreground)]"
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
                  className="py-1 text-sm text-[var(--foreground-muted)] transition hover:text-[var(--foreground)]"
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