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
    default: "Sara Mitchell | Business & Life Coaching for High Performers",
    template: "%s · Sara Mitchell",
  },
  description:
    "Sara Mitchell coaches high performers who look successful and feel stuck into their next real move. Private 1:1 and a small group. Six spots, by application.",
  metadataBase: new URL("https://saramcoach.com"),
  openGraph: {
    title: "Sara Mitchell | Business & Life Coaching for High Performers",
    description:
      "Coaching for people who are done playing small. Private 1:1 and a small group, six clients at a time. Book a quiet, no-pressure call.",
    type: "website",
    siteName: "Sara Mitchell Coaching",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sara Mitchell | Business & Life Coaching for High Performers",
    description:
      "Coaching for people who are done playing small. Private 1:1 and a small group, six clients at a time. Book a quiet, no-pressure call.",
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
