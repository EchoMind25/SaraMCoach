import type { Metadata, Viewport } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { LeadAssistant } from "@/components/assistant/LeadAssistant";

/* Display — Syne (variable). Headlines, prices, section titles, CTA labels. */
const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

/* Body — Inter (variable). All body copy, lists, prose. */
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

/* Mono — JetBrains Mono (variable). Eyebrows, labels, stats, code. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sara Mitchell — Mindset Coach for Professionals",
    template: "%s · Sara Mitchell",
  },
  description:
    "Sara Mitchell is a mindset and performance coach for mid-career professionals who look successful but feel stuck or burned out. Evidence-based 1:1 and group coaching to realign your career.",
  metadataBase: new URL("https://saramcoach.com"),
  openGraph: {
    title: "Sara Mitchell — Mindset Coach for Professionals",
    description:
      "Evidence-based mindset and performance coaching for mid-career professionals ready to move from burned out to dialed in.",
    type: "website",
    siteName: "Sara Mitchell Coaching",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sara Mitchell — Mindset Coach for Professionals",
    description:
      "Evidence-based mindset and performance coaching for mid-career professionals ready to move from burned out to dialed in.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Nav />
        {children}
        <Footer />
        <LeadAssistant />
      </body>
    </html>
  );
}
