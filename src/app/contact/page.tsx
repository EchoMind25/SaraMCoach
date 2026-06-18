import type { Metadata } from "next";
import { Callout, GlassCard, SectionEyebrow, SectionTitle } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { BookingPanel } from "@/components/contact/BookingPanel";
import { ContactForm } from "@/components/contact/ContactForm";
import { pageMetadata } from "@/lib/metadata";
import { DEMO, SARAH } from "@/lib/content";
import styles from "./contact.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Book a free 30-minute intro call with Sara Mitchell, or send a message. She reads every one herself and replies within one business day. Six spots open now.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className={styles.main}>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s find your{" "}
            <span className="text-gradient">next move.</span>
          </>
        }
        lead={`Pick a time below for a free, no-pressure intro call, or send a message and I'll reply personally within ${SARAH.responseSla}.`}
      />

      {/* ===== BOOKING (primary) ===== */}
      <section id="book" className={styles.section}>
        <div className={`container ${styles.bookingInner}`}>
          <Reveal>
            <Callout variant="violet" label="Demonstration">
              {DEMO.notice}
            </Callout>
          </Reveal>
          <Reveal delay={80}>
            <BookingPanel />
          </Reveal>
        </div>
      </section>

      {/* ===== CONTACT FORM (fallback) ===== */}
      <section className={styles.sectionAlt}>
        <div className={`container ${styles.contactGrid}`}>
          <Reveal className={styles.formCol}>
            <SectionEyebrow>Prefer to write first?</SectionEyebrow>
            <SectionTitle as="h2" className={styles.formTitle}>
              Send a message
            </SectionTitle>
            <p className={styles.formLead}>
              No forms to jump through and no qualifying questions. Just say
              hello and tell me what&apos;s going on.
            </p>
            <ContactForm />
          </Reveal>

          <Reveal delay={80} className={styles.infoCol}>
            <GlassCard interactive={false} className={styles.infoCard}>
              <span className={styles.infoLabel}>Other ways to reach me</span>
              <a href={`mailto:${SARAH.email}`} className={styles.infoEmail}>
                {SARAH.email}
              </a>
              <p className={styles.infoText}>
                I reply to every message personally, usually within{" "}
                {SARAH.responseSla}. If we&apos;re a fit, the next step is a quick
                call. If we&apos;re not, I&apos;ll point you somewhere that is.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
