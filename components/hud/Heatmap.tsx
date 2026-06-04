import type { ContributionCalendar } from "@/lib/github";

const LEVEL_OPACITY = [0.06, 0.3, 0.52, 0.76, 1] as const;

function cellStyle(level: 0 | 1 | 2 | 3 | 4): React.CSSProperties {
  return {
    backgroundColor: `color-mix(in srgb, var(--a) ${LEVEL_OPACITY[level] * 100}%, transparent)`,
    boxShadow: level >= 3 ? "0 0 8px -2px var(--glow)" : undefined,
  };
}

function dayLabel(date: string, count: number): string {
  const d = new Date(date + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${count} contribution${count === 1 ? "" : "s"} on ${d}`;
}

/**
 * GitHub contribution calendar rendered as a HUD "radar" grid. Cell intensity
 * uses the live accent (`--a`) so it retints with the loadout. Each cell is
 * individually labelled for screen readers; purely CSS, reduced-motion safe.
 */
export function Heatmap({ calendar }: { calendar: ContributionCalendar }) {
  return (
    <figure className="m-0">
      <figcaption className="telemetry mb-3 flex items-center justify-between text-[0.6rem] text-[var(--muted)]">
        <span>CONTRIBUTION TELEMETRY · LAST 12 MONTHS</span>
        <span className="text-[var(--a)]">
          {calendar.total.toLocaleString("en-US")} TOTAL
        </span>
      </figcaption>

      <div
        className="overflow-x-auto pb-1"
        role="img"
        aria-label={`${calendar.total} contributions in the last year`}
      >
        <div
          className="grid w-max grid-flow-col gap-[3px]"
          style={{ gridTemplateRows: "repeat(7, 11px)" }}
        >
          {calendar.weeks.map((week, wi) => (
            <div
              key={wi}
              className="grid gap-[3px]"
              style={{ gridTemplateRows: "repeat(7, 11px)" }}
            >
              {week.days.map((day) => (
                <span
                  key={day.date}
                  title={dayLabel(day.date, day.count)}
                  aria-label={dayLabel(day.date, day.count)}
                  className="h-[11px] w-[11px] rounded-[1px] border border-[var(--line)]"
                  style={cellStyle(day.level)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5">
        <span className="telemetry text-[0.55rem] text-[var(--muted)]">
          LESS
        </span>
        {([0, 1, 2, 3, 4] as const).map((l) => (
          <span
            key={l}
            className="h-[10px] w-[10px] rounded-[1px] border border-[var(--line)]"
            style={cellStyle(l)}
          />
        ))}
        <span className="telemetry text-[0.55rem] text-[var(--muted)]">
          MORE
        </span>
      </div>
    </figure>
  );
}
