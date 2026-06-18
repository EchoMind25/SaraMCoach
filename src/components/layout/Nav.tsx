"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/content";
import styles from "./Nav.module.css";

/**
 * Nav — fixed glass bar. Brand wordmark left, links + single CTA right.
 * Border strengthens once scrolled past 60px (§03 Nav spec). Active route
 * is highlighted via usePathname.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const classes = [styles.nav, scrolled && styles.scrolled]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={classes}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Sara Mitchell, home">
          Sara<span className={styles.dot}>.</span>
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[styles.link, active && styles.linkActive]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.cta}>
          <Button href="/contact" variant="primary">
            Book a Call
          </Button>
        </div>
      </div>
    </header>
  );
}
