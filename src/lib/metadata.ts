import type { Metadata } from "next";

/**
 * Builds per-page metadata (title, description, canonical, Open Graph,
 * Twitter card). The root layout's title template appends "· Sara Mitchell"
 * to the string title; OG/Twitter titles are composed explicitly here.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} · Sara Mitchell`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
