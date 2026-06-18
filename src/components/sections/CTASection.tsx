import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./CTASection.module.css";

type CTASectionProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  buttonLabel?: string;
  href?: string;
};

/**
 * CTASection — the single closing "book a call" band reused on every page.
 * Keeps the conversion architecture consistent: one action, everywhere.
 */
export function CTASection({
  eyebrow = "Ready when you are",
  title,
  lead,
  buttonLabel = "Book a Call",
  href = "/contact",
}: CTASectionProps) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <GlassCard interactive={false} className={styles.band}>
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <SectionTitle as="h2">{title}</SectionTitle>
            {lead ? <p className={styles.lead}>{lead}</p> : null}
            <div className={styles.actions}>
              <Button href={href} variant="primary">
                {buttonLabel}
              </Button>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
