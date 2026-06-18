import type { Metadata } from "next";
import {
  Badge,
  Button,
  GlassCard,
  SectionEyebrow,
  SectionTitle,
} from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { pageMetadata } from "@/lib/metadata";
import { OFFERS } from "@/lib/content";
import styles from "./services.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Two ways to work with Sara Mitchell: the Pivot Protocol, a private six-month 1:1, or the Inner Circle small group. Six clients at a time, by application.",
  path: "/services",
});

const STEPS = [
  {
    title: "Book a free call",
    body: "A 30-minute conversation to understand where you are and whether we're the right fit. No pitch, no pressure.",
  },
  {
    title: "We map your situation",
    body: "If it's a yes, we turn the fog into a clear picture of what's actually going on and where you want to go.",
  },
  {
    title: "You start the work",
    body: "Structured sessions, real frameworks, and the accountability to act on what we uncover, week over week.",
  },
];

export default function ServicesPage() {
  return (
    <main className={styles.main}>
      <PageHero
        eyebrow="How we work"
        title={
          <>
            Two clear paths to a{" "}
            <span className="text-gradient">career that fits.</span>
          </>
        }
        lead="No mystery packages. Each offer has one job: take you from stuck and depleted to clear, energized, and moving. Pick the level of support that fits."
        cta={{ label: "Book a Call", href: "/contact" }}
      />

      <section className={styles.section}>
        <div className={`container ${styles.offers}`}>
          {OFFERS.map((offer, index) => (
            <Reveal key={offer.id} delay={(index % 2) * 80}>
              <GlassCard
                as="article"
                interactive={false}
                className={[
                  styles.offerCard,
                  offer.featured && styles.featured,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {offer.featured ? (
                  <span className={styles.featuredBar} aria-hidden="true" />
                ) : null}

                <div className={styles.offerHead}>
                  <div className={styles.offerHeadMain}>
                    <div className={styles.offerTagRow}>
                      <span className={styles.cardLabel}>{offer.tag}</span>
                      {offer.featured ? <Badge>Most in-depth</Badge> : null}
                    </div>
                    <h2 className={styles.offerTitle}>{offer.title}</h2>
                    <p className={styles.offerSummary}>{offer.summary}</p>
                  </div>

                  <div className={styles.priceBlock}>
                    <span className={styles.price}>{offer.price}</span>
                    {offer.cadence ? (
                      <span className={styles.cadence}>{offer.cadence}</span>
                    ) : null}
                  </div>
                </div>

                <div className={styles.includes}>
                  <span className={styles.includesTitle}>What&apos;s included</span>
                  <ul className={styles.includesList}>
                    {offer.includes.map((item) => (
                      <li key={item} className={styles.includesItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.offerCta}>
                  <Button href="/contact" variant="primary">
                    Book a Call
                  </Button>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== WHAT HAPPENS NEXT ===== */}
      <section className={styles.sectionAlt}>
        <div className={`container ${styles.sectionInner}`}>
          <Reveal className={styles.sectionHead}>
            <SectionEyebrow>What happens next</SectionEyebrow>
            <SectionTitle>
              From first call to{" "}
              <span className="text-gradient">first shift.</span>
            </SectionTitle>
            <p className={styles.sectionLead}>
              Booking a call doesn&apos;t commit you to anything except a clearer
              head. Here&apos;s exactly how it goes.
            </p>
          </Reveal>

          <div className={styles.steps}>
            {STEPS.map((step, index) => (
              <Reveal key={step.title} delay={(index % 3) * 80}>
                <div className={styles.step}>
                  <span className={styles.stepNum}>{index + 1}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={
          <>
            Not sure which is{" "}
            <span className="text-gradient">right for you?</span>
          </>
        }
        lead="That's exactly what the first call is for. We'll figure it out together."
      />
    </main>
  );
}
