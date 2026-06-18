import type { Metadata } from "next";
import { GlassCard, SectionEyebrow } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { pageMetadata } from "@/lib/metadata";
import { CREDENTIALS } from "@/lib/content";
import styles from "./about.module.css";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Meet Sara Mitchell — a former finance leader turned mindset and performance coach who helps mid-career professionals rebuild clarity and momentum.",
  path: "/about",
});

const STORY = [
  {
    label: "Then",
    text: "For fifteen years I climbed the ladder everyone told me to climb. I led finance teams, hit every number, and collected the titles. From the outside it looked like success. Inside, I was running on empty.",
  },
  {
    label: "The shift",
    text: "The wake-up call wasn't dramatic — it was an ordinary Tuesday. I realized I'd built a career that impressed everyone but me, and that the very drive that got me there was quietly burning me out.",
  },
  {
    label: "Now",
    text: "So I retrained: in coaching, in performance psychology, in how high achievers actually change. Today I help professionals like the person I was — capable, accomplished, and ready for work that finally fits.",
  },
];

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <PageHero
        eyebrow="About"
        title={
          <>
            Hi, I&apos;m <span className="text-gradient">Sara.</span>
          </>
        }
        lead="A former finance leader who learned the hard way that a career can look right and feel wrong at the same time — and that you can change that without blowing it all up."
      />

      <section className={styles.section}>
        <div className={`container ${styles.aboutGrid}`}>
          <Reveal className={styles.portraitCol}>
            <figure className={styles.portrait}>
              <div className={styles.portraitMonogram} aria-hidden="true">
                SM
              </div>
              <figcaption className={styles.portraitCaption}>
                Sara Mitchell, PCC
              </figcaption>
            </figure>
          </Reveal>

          <div className={styles.storyCol}>
            <Reveal className={styles.story}>
              {STORY.map((step) => (
                <div key={step.label} className={styles.storyStep}>
                  <span className={styles.storyLabel}>{step.label}</span>
                  <p className={styles.storyText}>{step.text}</p>
                </div>
              ))}
            </Reveal>

            <Reveal delay={80}>
              <GlassCard interactive={false} className={styles.credCard}>
                <SectionEyebrow>Credentials</SectionEyebrow>
                <ul className={styles.credList}>
                  {CREDENTIALS.map((cred) => (
                    <li key={cred} className={styles.credItem}>
                      {cred}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Let's talk"
        title={
          <>
            Think we might be a{" "}
            <span className="text-gradient">good fit?</span>
          </>
        }
        lead="The first conversation is the easiest part. Let's find out where you are and what a clear next move could look like."
      />
    </main>
  );
}
