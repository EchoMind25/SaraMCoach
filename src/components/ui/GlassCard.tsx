import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./GlassCard.module.css";

type GlassCardProps = {
  /** Semantic element to render. Defaults to <div>. */
  as?: ElementType;
  /** Enables the spatial lift + 3D rotate on hover. Defaults to true. */
  interactive?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "className">;

/**
 * GlassCard — the system's core surface.
 * Glass fill + blur + border. On hover (when interactive) it performs the
 * 2026 spatial depth cue: translateY(-4px) + perspective rotateX(1.5deg),
 * border → border-hot, shadow → shadow-card.
 */
export function GlassCard({
  as,
  interactive = true,
  children,
  className,
  ...rest
}: GlassCardProps) {
  const Component = as ?? "div";
  const classes = [styles.card, interactive && styles.interactive, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}
