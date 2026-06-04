/**
 * Telemetry proficiency bar. Accessible (role="meter") and animation-ready:
 * the `.meter-fill` element is scaled from 0→1 in-view by the SkillMatrix.
 * With JS disabled / reduced motion it renders fully filled.
 */
export function MeterBar({
  label,
  value,
  className = "",
}: {
  label: string;
  value: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={className}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="display text-[0.8rem] tracking-wide text-[var(--txt)]">
          {label}
        </span>
        <span className="telemetry text-[0.66rem] text-[var(--a)]" aria-hidden>
          {pct.toString().padStart(2, "0")}%
        </span>
      </div>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`${label}: ${pct} percent`}
        className="relative h-[6px] w-full overflow-hidden rounded-[1px] border border-[var(--line)] bg-black/30"
      >
        <span
          className="meter-fill absolute inset-y-0 left-0 origin-left"
          data-value={pct}
          style={{
            width: `${pct}%`,
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--a) 55%, transparent), var(--a))",
            boxShadow: "0 0 12px -2px var(--glow)",
          }}
        />
      </div>
    </div>
  );
}
