import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { JukeboxProvider } from "@/components/audio/JukeboxProvider";
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
      <body>
        <JukeboxProvider>{children}</JukeboxProvider>
      </body>
    </html>
  );
}
