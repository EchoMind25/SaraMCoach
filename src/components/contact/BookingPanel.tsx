"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { SARAH } from "@/lib/content";
import styles from "./BookingPanel.module.css";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

/**
 * BookingPanel — the contact page's primary booking element: the client's live
 * Calendly inline embed (§05 / §07). Calendly's color params are set to the site
 * palette: background = navy (#1A1A2E), text = ghost (#F0F0FF), primary = indigo
 * (#6C63FF). The booking URL itself lives in SARAH.calendly (src/lib/content.ts).
 */

// hide_event_type_details=1 hides Calendly's left panel (host name + event
// title) so our own header supplies that context and the builder's name stays
// out of the embed. The host name still shows on the standalone Calendly page,
// so rename the event/profile in Calendly too (see GO-LIVE.md).
const CALENDLY_URL = `${SARAH.calendly}?hide_gdpr_banner=1&hide_event_type_details=1&background_color=1a1a2e&text_color=f0f0ff&primary_color=6c63ff`;

export function BookingPanel() {
  const hostRef = useRef<HTMLDivElement>(null);

  // Initialize the inline widget explicitly instead of relying on widget.js's
  // auto-init. Auto-init only fires the first time the script loads, so on a
  // client-side navigation to /contact the embed would otherwise render blank.
  // Calling initInlineWidget on mount (and on script load) covers both hard
  // loads and SPA navigations; clearing the host first avoids stacked iframes.
  const init = () => {
    const host = hostRef.current;
    if (!host || !window.Calendly) return;
    host.innerHTML = "";
    window.Calendly.initInlineWidget({ url: CALENDLY_URL, parentElement: host });
  };

  useEffect(() => {
    init();
    // init is stable for the component's lifetime; run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Grab a time with {SARAH.firstName}</h3>
        <p className={styles.subtitle}>30-minute intro call · video</p>
      </div>

      <div
        ref={hostRef}
        className={styles.embed}
        aria-label={`Book a call with ${SARAH.name}`}
      />

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={init}
      />
    </div>
  );
}
