import Link from "next/link";
import {
  Badge,
  Button,
  Callout,
  GlassCard,
  SectionEyebrow,
  SectionTitle,
} from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { ParticleField } from "@/components/visual/ParticleField";
import { CTASection } from "@/components/sections/CTASection";
import { OFFERS, TESTIMONIALS } from "@/lib/content";
import styles from "./page.module.css";

const HERO_STATS = [
  { value: "90 days", label: "To a clear next move" },
  { value: "200+", label: "Professionals coached" },
  { value: "32–50", label: "Mid-career focus" },
];

const SIGNS = [
  {
    title: "You've hit the targets",
    body: "Title, comp, the résumé people envy. On paper, you've made it.",
  },
  {
    title: "But it feels off",
    body: "The drive that got you here has quietly turned into depletion.",
  },
  {
    title: "You're ready to move",
    body: "Not a reckless leap — a clear, deliberate next move you can commit to.",
  },
];

export default function Home() {
  return (
    <main id="top" className={styles.main}>
      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <ParticleField className={styles.heroCanvas} />
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={`container ${styles.heroInner}`}>
          <div className={`${styles.fadeUp} ${styles.d1} ${styles.heroEyebrow}`}>
            <SectionEyebrow>Mindset &amp; Performance Coaching</SectionEyebrow>
            <Badge>Now booking · 1:1 + Group</Badge>
          </div>

          <h1 className={`${styles.heroTitle} ${styles.fadeUp} ${styles.d2}`}>
            From burned out
            <br />
            <span className="text-gradient">to dialed in.</span>
          </h1>

          <p className={`${styles.heroLead} ${styles.fadeUp} ${styles.d3}`}>
            I&apos;m Sara Mitchell — a mindset and performance coach for
            mid-career professionals who look successful on paper but feel stuck
            underneath. Together we rebuild clarity, momentum, and a career that
            actually fits. No fluff. No burnout as usual.
          </p>

          <div className={`${styles.heroCtas} ${styles.fadeUp} ${styles.d4}`}>
            <Button href="/contact" variant="primary">
              Book a Call
            </Button>
            <Link href="/services" className={styles.textLink}>
              See how we&apos;d work together →
            </Link>
          </div>

          <div className={`${styles.heroStats} ${styles.fadeUp} ${styles.d5}`}>
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.scrollHint} ${styles.fadeUp} ${styles.d6}`}>
          <span>Scroll</span>
          <span className={styles.scrollLine} aria-hidden="true" />
        </div>
      </section>

      {/* ===== SOCIAL PROOF STRIP ===== */}
      <section className={styles.proofStrip}>
        <div className={`container ${styles.proofInner}`}>
          <span className={styles.proofLabel}>
            Trusted by senior professionals
          </span>
          <div className={styles.proofRow}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className={styles.proofItem}>
                <span className={styles.avatar} aria-hidden="true">
                  {t.initials}
                </span>
                <span className={styles.proofMeta}>
                  <span className={styles.proofName}>{t.name}</span>
                  <span className={styles.proofRole}>{t.role}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHO I HELP ===== */}
      <section className={styles.section}>
        <div className={`container ${styles.sectionInner}`}>
          <Reveal className={styles.sectionHead}>
            <SectionEyebrow>Who I help</SectionEyebrow>
            <SectionTitle>
              You&apos;ve done everything right.{" "}
              <span className="text-gradient">So why does it feel wrong?</span>
            </SectionTitle>
            <p className={styles.sectionLead}>
              Most of my clients aren&apos;t failing. They&apos;re succeeding at
              something that no longer fits — and they&apos;re tired of pretending
              it does.
            </p>
          </Reveal>

          <div className={styles.signsGrid}>
            {SIGNS.map((sign, index) => (
              <Reveal key={sign.title} delay={(index % 3) * 80}>
                <GlassCard className={styles.signCard}>
                  <span className={styles.signNum}>0{index + 1}</span>
                  <h3 className={styles.cardTitle}>{sign.title}</h3>
                  <p className={styles.cardBody}>{sign.body}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <Callout variant="indigo" label="Who this is for">
              Corporate professionals, roughly 32–50. High achievers who&apos;ve
              hit the targets and still feel misaligned — and are finally ready to
              do something about it.
            </Callout>
          </Reveal>
        </div>
      </section>

      {/* ===== OFFERS PREVIEW ===== */}
      <section id="work" className={styles.sectionAlt}>
        <div className={`container ${styles.sectionInner}`}>
          <Reveal className={styles.sectionHead}>
            <SectionEyebrow>How we work</SectionEyebrow>
            <SectionTitle>
              Two ways to work <span className="text-gradient">together.</span>
            </SectionTitle>
            <p className={styles.sectionLead}>
              Focused 1:1 attention or the momentum of a group — same work, two
              ways in.
            </p>
          </Reveal>

          <div className={styles.offersGrid}>
            {OFFERS.map((offer, index) => (
              <Reveal key={offer.id} delay={(index % 2) * 80}>
                <GlassCard as="article" className={styles.offerCard}>
                  <span className={styles.cardLabel}>{offer.tag}</span>
                  <h3 className={styles.cardTitle}>{offer.title}</h3>
                  <p className={styles.cardBody}>{offer.summary}</p>
                  <div className={styles.offerFoot}>
                    {offer.price ? (
                      <span className={styles.cardPrice}>
                        {offer.price}
                        {offer.cadence === "per month" ? (
                          <span className={styles.priceUnit}>/mo</span>
                        ) : null}
                      </span>
                    ) : null}
                    <Link href="/services" className={styles.textLink}>
                      Details →
                    </Link>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <CTASection
        title={
          <>
            Let&apos;s get you{" "}
            <span className="text-gradient">aligned again.</span>
          </>
        }
        lead="One conversation. We'll figure out whether the Pivot Protocol or the Clarity Circle is the right next step for you."
      />
    </main>
  );
}
