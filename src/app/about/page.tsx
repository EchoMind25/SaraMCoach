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
    "Sara Mitchell spent ten years in corporate HR watching good people get overlooked. Now she coaches high performers in Nashville and beyond into their next move.",
  path: "/about",
});

const STORY = [
  {
    label: "Then",
    text: "I spent ten years in corporate HR with a front-row seat to every promotion, every raise, and every quiet exit. I watched talented people stall out for one reason. Nobody had taught them how to advocate for themselves.",
  },
  {
    label: "The shift",
    text: "I got tired of watching it from the sidelines. The people who needed help most were the ones who looked fine on paper, so no one ever offered. I left to do something about it on purpose.",
  },
  {
    label: "Now",
    text: "I run my coaching practice from Nashville and work with clients everywhere. They're the same people I used to watch get passed over. Capable, accomplished, and done waiting for permission to make their move.",
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
        lead="Ten years in corporate HR taught me that a career can look right and feel wrong at the same time. It also taught me you can change that without blowing up your life."
      />

      <section className={styles.section}>
        <div className={`container ${styles.aboutGrid}`}>
          <Reveal className={styles.portraitCol}>
            <figure className={styles.portrait}>
              <div className={styles.portraitMonogram} aria-hidden="true">
                SM
              </div>
              <figcaption className={styles.portraitCaption}>
                Sara Mitchell, Nashville
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
