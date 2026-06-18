import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { SectionTitle } from "@/components/ui/SectionTitle";
import styles from "./PageHero.module.css";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  cta?: { label: string; href: string };
};

/**
 * PageHero — compact interior-page header with an ambient glow and a
 * staggered load-in. The full particle hero is reserved for Home.
 */
export function PageHero({ eyebrow, title, lead, cta }: PageHeroProps) {
  return (
    <header className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <SectionTitle as="h1" className={styles.title}>
          {title}
        </SectionTitle>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
        {cta ? (
          <div className={styles.cta}>
            <Button href={cta.href} variant="primary">
              {cta.label}
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
