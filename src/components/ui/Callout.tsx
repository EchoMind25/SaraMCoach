import type { ReactNode } from "react";
import styles from "./Callout.module.css";

export type CalloutVariant = "indigo" | "violet" | "success";

type CalloutProps = {
  variant?: CalloutVariant;
  /** Mono uppercase label shown above the body. */
  label?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Callout — left-accented tinted panel.
 * Variant drives both the left border color and the label color.
 */
export function Callout({
  variant = "indigo",
  label,
  children,
  className,
}: CalloutProps) {
  const classes = [styles.callout, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label ? <div className={styles.label}>{label}</div> : null}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
