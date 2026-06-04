import { createElement, type ElementType, type ReactNode } from "react";
import { Corners } from "@/components/hud/HudFrame";

/**
 * Glass HUD panel with corner brackets and an optional top-left telemetry
 * label. Presentational; safe in server or client trees.
 */
export function Panel({
  as: Tag = "div",
  children,
  className = "",
  label,
  corners = true,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  label?: string;
  corners?: boolean;
}) {
  // createElement (instead of <Tag>) renders the dynamic tag without resolving
  // the full intrinsic-element union (which R3F's JSX augmentation makes
  // too-complex / never for children).
  return createElement(
    Tag,
    { className: `glass relative ${className}` },
    corners ? <Corners /> : null,
    label ? (
      <span className="telemetry absolute -top-2 left-4 bg-[var(--bg)] px-1.5 text-[0.62rem] text-[var(--a)]">
        {label}
      </span>
    ) : null,
    children,
  );
}
