import type { ReactNode } from "react";
import styles from "./SectionTitle.module.css";

type Level = "h1" | "h2" | "h3";

type SectionTitleProps = {
  /** Heading level. Defaults to h2. */
  as?: Level;
  children: ReactNode;
  className?: string;
  id?: string;
};

/**
 * SectionTitle — Syne 700 at --text-section.
 * Wrap emphasized words in <span className="text-gradient"> for the
 * canonical indigo→violet clip.
 */
export function SectionTitle({
  as: Component = "h2",
  children,
  className,
  id,
}: SectionTitleProps) {
  const classes = [styles.title, className].filter(Boolean).join(" ");
  return (
    <Component className={classes} id={id}>
      {children}
    </Component>
  );
}
