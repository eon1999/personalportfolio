import { ImageResponse } from "next/og";
import { PROFILE, HERO_BIO } from "@/data/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${PROFILE.shortName} — ${PROFILE.terminal}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090a",
          color: "#e9e6dd",
          fontFamily: "monospace",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            color: "#6d716f",
          }}
        >
          <span>{PROFILE.terminal} / OPERATOR FILE</span>
          <span style={{ color: "#ff6a00" }}>● {PROFILE.status}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              lineHeight: 1,
              letterSpacing: 2,
            }}
          >
            {PROFILE.firstName} {PROFILE.lastName}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.5,
              maxWidth: 920,
              color: "#c8c5bc",
            }}
          >
            {HERO_BIO}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 3,
            color: "#6d716f",
          }}
        >
          <span>{PROFILE.location}</span>
          <span>{PROFILE.class}</span>
        </div>
      </div>
    ),
    size,
  );
}
