import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { JukeboxProvider } from "@/components/audio/JukeboxProvider";
import { FireDrift } from "@/components/chrome/FireDrift";
import { SettingsProvider } from "@/components/settings/SettingsProvider";
import { CHROME_SCALE_BOOTSTRAP } from "@/lib/settings";
import { HERO_BIO, LINKS, PROFILE } from "@/data/profile";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// The display face is Times New Roman — installed everywhere the site is
// likely to be read, so there is no webfont to fetch. See `--font-display`.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "V. DANG — TERMINAL 001",
    template: "%s — V. DANG",
  },
  description: HERO_BIO,
  keywords: [
    "Viet-Anh Dang",
    "UT Austin computer science",
    "machine learning research",
    "Oden Institute",
    "full-stack developer portfolio",
  ],
  authors: [{ name: PROFILE.shortName }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "V. DANG — TERMINAL 001",
    title: "V. DANG — TERMINAL 001",
    description: HERO_BIO,
  },
  twitter: {
    card: "summary_large_image",
    title: "V. DANG — TERMINAL 001",
    description: HERO_BIO,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: `${PROFILE.firstName} ${PROFILE.lastName}`,
  alternateName: PROFILE.shortName,
  url: SITE_URL,
  email: `mailto:${PROFILE.email}`,
  jobTitle: "Computer Science Student & Engineering Fellow",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Texas at Austin",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Austin",
    addressRegion: "TX",
  },
  sameAs: [LINKS.github],
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        {/* Blocking on purpose, and tiny: it puts the visitor's chrome scale
            on the document before the first paint, so the bars never come up
            at the default and snap. A raw tag rather than `next/script` —
            `beforeInteractive` is for `src` scripts, and an inline one gets
            re-created on the client, where React never executes it. */}
        <script
          dangerouslySetInnerHTML={{ __html: CHROME_SCALE_BOOTSTRAP }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <FireDrift />
        <SettingsProvider>
          <JukeboxProvider>{children}</JukeboxProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
