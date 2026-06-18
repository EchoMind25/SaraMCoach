import { Button } from "@/components/ui/Button";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { SectionTitle } from "@/components/ui/SectionTitle";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <span className={styles.code}>404</span>
        <SectionEyebrow>Page not found</SectionEyebrow>
        <SectionTitle as="h1">
          This page took an{" "}
          <span className="text-gradient">unexpected pivot.</span>
        </SectionTitle>
        <p className={styles.lead}>
          The page you&apos;re looking for isn&apos;t here — but your next move
          might be one conversation away.
        </p>
        <div className={styles.actions}>
          <Button href="/" variant="primary">
            Back to home
          </Button>
          <Button href="/contact" variant="ghost">
            Book a call
          </Button>
        </div>
      </div>
    </main>
  );
}
