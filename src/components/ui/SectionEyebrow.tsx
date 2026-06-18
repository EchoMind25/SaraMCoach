import type { ReactNode } from "react";
import styles from "./SectionEyebrow.module.css";

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
};

/**
 * SectionEyebrow — mono label preceded by a 20px indigo rule.
 * JetBrains Mono · --text-xs · indigo · 0.2em tracking · uppercase.
 */
export function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  const classes = [styles.eyebrow, className].filter(Boolean).join(" ");
  return <span className={classes}>{children}</span>;
}
