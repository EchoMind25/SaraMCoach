import type { Metadata } from "next";
import { GlassCard, SectionEyebrow, SectionTitle } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { pageMetadata } from "@/lib/metadata";
import { TESTIMONIALS } from "@/lib/content";
import styles from "./results.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Results",
  description:
    "Real outcomes from senior professionals who worked with Sara Mitchell — from quietly stuck to clear, energized, and moving.",
  path: "/results",
});

const CASE_STUDY = [
  {
    label: "Before",
    text: "Priya had been a Marketing Director for six years. On paper she was thriving; privately, she'd been rehearsing her resignation for two.",
  },
  {
    label: "The work",
    text: "Over the Pivot Protocol's 90 days, we separated genuine misalignment from burnout, rebuilt her decision-making under pressure, and designed a move she could fully stand behind.",
  },
  {
    label: "The result",
    text: "She didn't quit. She negotiated a redefined role and a new team-lead hire — and took her first real vacation in three years. She called it “the clearest I've felt in a decade.”",
  },
];

export default function ResultsPage() {
  return (
    <main className={styles.main}>
      <PageHero
        eyebrow="Results"
        title={
          <>
            Quietly stuck, then{" "}
            <span className="text-gradient">genuinely moving.</span>
          </>
        }
        lead="Coaching is a trust business, so I'll let the work speak. Here are senior professionals who were successful and stuck — and what shifted once they did the work."
      />

      {/* ===== TESTIMONIALS ===== */}
      <section className={styles.section}>
        <div className={`container ${styles.testimonialGrid}`}>
          {TESTIMONIALS.map((t, index) => (
            <Reveal key={t.name} delay={(index % 3) * 80}>
              <GlassCard className={styles.testimonialCard}>
                <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
                <div className={styles.person}>
                  <span className={styles.avatar} aria-hidden="true">
                    {t.initials}
                  </span>
                  <span className={styles.personMeta}>
                    <span className={styles.personName}>{t.name}</span>
                    <span className={styles.personRole}>{t.role}</span>
                  </span>
                </div>
                <span className={styles.context}>{t.context}</span>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== CASE STUDY ===== */}
      <section className={styles.sectionAlt}>
        <div className={`container ${styles.sectionInner}`}>
          <Reveal className={styles.sectionHead}>
            <SectionEyebrow>Case study</SectionEyebrow>
            <SectionTitle>
              The move she&apos;d been{" "}
              <span className="text-gradient">circling for two years.</span>
            </SectionTitle>
          </Reveal>

          <Reveal>
            <GlassCard interactive={false} className={styles.caseCard}>
              <div className={styles.caseGrid}>
                {CASE_STUDY.map((part) => (
                  <div key={part.label} className={styles.casePart}>
                    <span className={styles.caseLabel}>{part.label}</span>
                    <p className={styles.caseText}>{part.text}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      <CTASection
        title={
          <>
            Your turn to get{" "}
            <span className="text-gradient">unstuck.</span>
          </>
        }
        lead="Every one of these started with a single, low-pressure call. Yours can too."
      />
    </main>
  );
}
