import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { JukeboxProvider } from "@/components/audio/JukeboxProvider";
import { FireDrift } from "@/components/chrome/FireDrift";
import { SettingsProvider } from "@/components/settings/SettingsProvider";
import { CHROME_SCALE_BOOTSTRAP } from "@/lib/settings";
import "./globals.css";

// The display face is Times New Roman — installed everywhere the site is
// likely to be read, so there is no webfont to fetch. See `--font-display`.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "V. DANG — TERMINAL 001",
  description:
    "Viet-Anh Dang — CS student at UT Austin. Machine learning research at the Oden Institute, full-stack platforms, and research tooling.",
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
