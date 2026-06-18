"use client";

import { createElement, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useScrollReveal } from "./useScrollReveal";
import styles from "./Reveal.module.css";

type RevealProps = {
  /** Element to render. Defaults to <div>. */
  as?: ElementType;
  /** Stagger delay in milliseconds. */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Reveal — wraps content and fades + lifts it into place on scroll.
 * opacity 0 → 1, translateY(32px) → 0 over --duration-reveal.
 * Pass `delay` to stagger siblings, e.g. (index % 4) * 80.
 */
export function Reveal({
  as = "div",
  delay = 0,
  className,
  children,
}: RevealProps) {
  const { ref, visible } = useScrollReveal<HTMLElement>();
  const classes = [styles.reveal, visible && styles.visible, className]
    .filter(Boolean)
    .join(" ");
  const style: CSSProperties | undefined =
    delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return createElement(as, { ref, className: classes, style }, children);
}
