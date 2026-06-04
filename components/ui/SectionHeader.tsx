import type { ReactNode } from "react";

/**
 * Standard module header: a monospace index, a display title and a drawing
 * rule (animated in-view via DrawSVG in the animation phase). Optional
 * right-aligned status slot for live indicators.
 */
export function SectionHeader({
  index,
  title,
  status,
}: {
  index: string;
  title: string;
  status?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-end gap-3">
        <span className="telemetry text-[0.7rem] text-[var(--a)]">
          {`${index} //`}
        </span>
        <h2 className="display text-2xl font-600 leading-none text-[var(--txt)] sm:text-3xl">
          {title}
        </h2>
      </div>
      {status ? <div className="flex items-center gap-2">{status}</div> : null}
      <div className="relative h-px w-full">
        <span
          data-rule
          className="absolute inset-0 origin-left"
          style={{
            background:
              "linear-gradient(90deg, var(--line-strong), transparent)",
          }}
        />
      </div>
    </header>
  );
}
