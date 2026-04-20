type Props = {
  className?: string;
  /** size of "mei" text */
  size?: "sm" | "md" | "lg";
  tone?: "navy" | "cream";
};

/**
 * Wordmark "mei" — geométrico, lowercase, com risquinho verde + amarelo.
 * Reproduzido em SVG para nitidez perfeita em qualquer escala.
 */
export function MeiLogo({ className = "", size = "md", tone = "navy" }: Props) {
  const sizes = {
    sm: { text: "text-2xl", bar: "h-[2px] w-7 mt-1" },
    md: { text: "text-4xl", bar: "h-[3px] w-10 mt-1.5" },
    lg: { text: "text-6xl", bar: "h-[4px] w-16 mt-2" },
  }[size];

  const color = tone === "cream" ? "text-cream" : "text-navy";

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <span
        className={`font-display ${sizes.text} ${color} leading-none tracking-tight lowercase`}
      >
        mei
      </span>
      <span
        className={`block ${sizes.bar} rounded-sm`}
        style={{
          background:
            "linear-gradient(to right, var(--color-verde-br) 0 50%, var(--color-amarelo) 50% 100%)",
        }}
        aria-hidden
      />
    </div>
  );
}
