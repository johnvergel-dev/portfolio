"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site.config";
import { LoadoutSwitcher } from "./LoadoutSwitcher";
import { AudioToggle } from "@/components/fx/AudioToggle";

/** UTC readout — mounts client-side only to avoid SSR/clock hydration drift. */
function SystemClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        }),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="telemetry hidden text-[0.6rem] text-[var(--muted)] sm:inline">
      {time ? `${time} UTC` : "--:--:-- UTC"}
    </span>
  );
}

/** Fixed HUD status bar: identity + live indicator on the left, loadout on the right. */
export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="live-dot" aria-hidden />
          <span className="telemetry text-[0.62rem] text-[var(--txt)]">
            {siteConfig.callsign}
          </span>
          <span className="telemetry hidden text-[0.6rem] text-[var(--muted)] md:inline">
            {"// SYS.ONLINE"}
          </span>
          <SystemClock />
          <AudioToggle />
        </div>
        <LoadoutSwitcher />
      </div>
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent"
      />
    </header>
  );
}
