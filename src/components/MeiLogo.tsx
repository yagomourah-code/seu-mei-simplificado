type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
  tone?: "navy" | "cream";
};

/**
 * Wordmark "mei" — lowercase com risquinho verde + amarelo.
 */
export function MeiLogo({ className = "", size = "md", tone = "navy" }: Props) {
  const sizes = {
    sm: { text: "text-3xl", bar: "h-[2px] w-8 mt-1.5" },
    md: { text: "text-5xl", bar: "h-[3px] w-12 mt-2" },
    lg: { text: "text-7xl", bar: "h-[4px] w-20 mt-3" },
  }[size];

  const color = tone === "cream" ? "text-cream" : "text-foreground";

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <span
        className={`font-display ${sizes.text} ${color} leading-[0.9] lowercase font-medium`}
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
