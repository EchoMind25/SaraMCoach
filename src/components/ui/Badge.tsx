import type { ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Badge — pill on the primary gradient. JetBrains Mono, white, uppercase.
 */
export function Badge({ children, className }: BadgeProps) {
  const classes = [styles.badge, className].filter(Boolean).join(" ");
  return <span className={classes}>{children}</span>;
}
