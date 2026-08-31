type MapEmbedProps = {
  titleEs: string;
  titleEn: string;
  addressEs: string;
  addressEn: string;
  embedUrl: string;
  lang?: "es" | "en";
};

export default function MapEmbed({
  titleEs,
  titleEn,
  addressEs,
  addressEn,
  embedUrl,
  lang = "es",
}: MapEmbedProps) {
  return (
    <div className="w-full">
      <h3 className="text-xl font-serif font-semibold text-[var(--foreground)]">
        {lang === "es" ? titleEs : titleEn}
      </h3>
      <p className="mt-1 text-sm text-[var(--foreground-muted)]">
        {lang === "es" ? addressEs : addressEn}
      </p>

      <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border border-[var(--background-alt)]">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={lang === "es" ? titleEs : titleEn}
        />
      </div>
    </div>
  );
}