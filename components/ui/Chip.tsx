import type { ReactNode } from "react";

/** Small monospace tag chip with a subtle accent hover glow. */
export function Chip({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <span
      title={title}
      className="telemetry inline-flex items-center rounded-[2px] border border-[var(--line)] px-2 py-0.5 text-[0.62rem] leading-5 text-[var(--txt)]/80 transition-[color,border-color,box-shadow] duration-300 hover:border-[var(--line-strong)] hover:text-[var(--a)] hover:[box-shadow:0_0_16px_-6px_var(--glow)]"
    >
      {children}
    </span>
  );
}
