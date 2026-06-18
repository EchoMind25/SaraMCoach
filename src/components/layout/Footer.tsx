import Link from "next/link";
import { DEMO, NAV_LINKS, SARAH } from "@/lib/content";
import styles from "./Footer.module.css";

const YEAR = 2026;

/**
 * Footer — site-wide. Brand + tagline, navigation, and contact.
 * The single prominent booking action lives in CTASection; the footer's
 * booking link is a quiet text link, not a competing CTA.
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandBlock}>
          <Link href="/" className={styles.brand}>
            Sara<span className={styles.dot}>.</span>
          </Link>
          <p className={styles.tagline}>
            Mindset &amp; performance coaching for mid-career professionals ready
            to move from burned out to dialed in.
          </p>
        </div>

        <nav className={styles.col} aria-label="Footer">
          <span className={styles.colTitle}>Explore</span>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.col}>
          <span className={styles.colTitle}>Get in touch</span>
          <Link href="/contact" className={styles.link}>
            Book a call
          </Link>
          <a href={`mailto:${SARAH.email}`} className={styles.link}>
            {SARAH.email}
          </a>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span className={styles.copy}>
          © {YEAR} {SARAH.name} Coaching. All rights reserved.
        </span>
        <span className={styles.fineprint}>{DEMO.short}</span>
      </div>
    </footer>
  );
}
