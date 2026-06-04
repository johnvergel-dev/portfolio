/** Graceful "no data for this loadout" state (§7). */
export function EmptyState({ note = "SIGNAL CLEAR" }: { note?: string }) {
  return (
    <div className="glass relative flex items-center justify-center px-6 py-14">
      <p className="telemetry text-center text-[var(--muted)]">
        NO DATA <span className="text-[var(--a)]">{"//"}</span> {note}
      </p>
    </div>
  );
}
