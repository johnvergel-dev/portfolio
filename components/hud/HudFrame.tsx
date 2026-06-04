import type { ReactNode } from "react";

/**
 * Decorative L-shaped corner brackets. Drop into any `position: relative`
 * container. Purely presentational and aria-hidden.
 */
export function Corners({ size = 14 }: { size?: number }) {
  const base =
    "pointer-events-none absolute h-[var(--c)] w-[var(--c)] border-[var(--a)]";
  const style = { ["--c" as string]: `${size}px` } as React.CSSProperties;
  return (
    <span aria-hidden style={style}>
      <span className={`${base} left-[-1px] top-[-1px] border-l border-t`} />
      <span className={`${base} right-[-1px] top-[-1px] border-r border-t`} />
      <span className={`${base} bottom-[-1px] left-[-1px] border-b border-l`} />
      <span
        className={`${base} bottom-[-1px] right-[-1px] border-b border-r`}
      />
    </span>
  );
}

/**
 * Full-bleed HUD chrome overlay: scanlines + vignette. Mounted once behind the
 * content. Decorative only.
 */
export function HudChrome() {
  return (
    <div
      aria-hidden
      className="scanlines vignette pointer-events-none fixed inset-0 z-[1]"
    />
  );
}

/** A labelled HUD section wrapper used by every module. */
export function HudSection({
  id,
  children,
  className = "",
  "aria-label": ariaLabel,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`relative mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}
    >
      {children}
    </section>
  );
}
