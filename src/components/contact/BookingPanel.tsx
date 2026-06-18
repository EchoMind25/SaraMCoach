"use client";

import Script from "next/script";
import { SARAH } from "@/lib/content";
import styles from "./BookingPanel.module.css";

/**
 * BookingPanel — the contact page's primary booking element: the client's live
 * Calendly inline embed (§05 / §07). Calendly's color params are set to the site
 * palette: background = navy (#1A1A2E), text = ghost (#F0F0FF), primary = indigo
 * (#6C63FF). The booking URL itself lives in SARAH.calendly (src/lib/content.ts).
 */

// hide_event_type_details=1 hides Calendly's left panel (host name + event
// title) — our own header supplies that context, and it keeps the builder's
// name out of the embed. The host name still shows on the standalone Calendly
// page, so rename the event/profile in Calendly too (see GO-LIVE.md).
const CALENDLY_URL = `${SARAH.calendly}?hide_gdpr_banner=1&hide_event_type_details=1&background_color=1a1a2e&text_color=f0f0ff&primary_color=6c63ff`;

export function BookingPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Grab a time with {SARAH.firstName}</h3>
        <p className={styles.subtitle}>30-minute intro call · video</p>
      </div>

      <div
        className={`calendly-inline-widget ${styles.embed}`}
        data-url={CALENDLY_URL}
        aria-label={`Book a call with ${SARAH.name}`}
      />

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
