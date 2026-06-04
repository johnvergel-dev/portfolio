import type { ComponentType, ReactNode } from "react";

interface BaseProps {
  children: ReactNode;
  icon?: ComponentType<{ size?: number; className?: string }>;
  variant?: "solid" | "ghost";
  className?: string;
}

type AnchorProps = BaseProps & {
  href: string;
  external?: boolean;
  onClick?: never;
};

type ButtonProps = BaseProps & {
  href?: undefined;
  onClick?: () => void;
};

/**
 * HUD-styled call-to-action. Renders an anchor when `href` is set, otherwise a
 * button. The `data-magnetic` hook lets the Magnetic effect (Phase 4) target it
 * without re-wrapping. Includes a visible focus ring via the global styles.
 */
export function HudButton(props: AnchorProps | ButtonProps) {
  const { children, icon: Icon, variant = "ghost", className = "" } = props;
  const styles =
    variant === "solid"
      ? "bg-[color-mix(in_srgb,var(--a)_16%,transparent)] text-[var(--a)] border-[var(--line-strong)]"
      : "text-[var(--txt)] border-[var(--line)] hover:text-[var(--a)]";
  const cls = `group inline-flex items-center gap-2 rounded-[2px] border px-4 py-2 telemetry text-[0.68rem] transition-[color,border-color,background-color,box-shadow] duration-300 hover:border-[var(--line-strong)] hover:[box-shadow:0_0_22px_-8px_var(--glow)] ${styles} ${className}`;

  const content = (
    <>
      {Icon ? <Icon size={14} className="shrink-0" /> : null}
      <span>{children}</span>
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const external = props.external;
    return (
      <a
        href={props.href}
        data-magnetic
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      data-magnetic
      className={cls}
      onClick={(props as ButtonProps).onClick}
    >
      {content}
    </button>
  );
}
