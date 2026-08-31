import { ReactNode } from "react";

type SectionProps = {
  id?: string;
  titleEs: string;
  titleEn: string;
  subtitleEs?: string;
  subtitleEn?: string;
  children?: ReactNode;
  variant?: "default" | "alt";
};

export default function Section({
  id,
  titleEs,
  titleEn,
  subtitleEs,
  subtitleEn,
  children,
  variant = "default",
}: SectionProps) {
  const bg =
    variant === "alt"
      ? "bg-[var(--background-alt)]"
      : "bg-[var(--background)]";

  return (
    <section id={id} className={`${bg} border-t border-[var(--background-alt)]`}>
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl sm:text-5xl font-serif font-semibold text-[var(--foreground)] text-center">
          {titleEs} <span className="text-[var(--accent)]">/</span> {titleEn}
        </h2>

        {(subtitleEs || subtitleEn) && (
          <p className="mt-4 text-center text-[var(--foreground-muted)] font-sans max-w-2xl mx-auto">
            {subtitleEs}
            {subtitleEs && subtitleEn && " / "}
            {subtitleEn}
          </p>
        )}

        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}