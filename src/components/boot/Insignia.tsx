"use client";

import { useEffect, useRef } from "react";
import { animate, createScope, type Scope } from "animejs";
import { prefersReducedMotion } from "@/lib/prefs";
import { INSIGNIA } from "@/lib/standby";

/**
 * The standby screen's centrepiece: three orbitals turning clockwise,
 * counter-clockwise and clockwise around a triangle sitting in a pulsing aura.
 *
 * Rotation is applied to the SVG groups with `transform-box: view-box`, so the
 * origin is the centre of the viewBox regardless of what each group's own
 * bounding box happens to be — an orbital's marker node would otherwise pull
 * its origin off-centre and make the ring wobble.
 */
export function Insignia() {
  const rootRef = useRef<SVGSVGElement>(null);
  const scopeRef = useRef<Scope | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (prefersReducedMotion()) return;

    scopeRef.current = createScope({ root }).add(() => {
      for (const orbital of INSIGNIA.orbitals) {
        animate(`.orbital-${orbital.id}`, {
          rotate: orbital.direction * 360,
          duration: orbital.period,
          ease: "linear",
          loop: true,
        });
      }

      animate(".insignia-aura", {
        scale: [1, 1.22],
        opacity: [0.45, 1],
        duration: INSIGNIA.auraPulse,
        ease: "inOutSine",
        loop: true,
        alternate: true,
      });

      animate(".insignia-core", {
        opacity: [0.9, 0.6, 1, 0.88],
        duration: INSIGNIA.coreFlicker,
        ease: "linear",
        loop: true,
      });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, []);

  return (
    <svg
      ref={rootRef}
      aria-hidden
      viewBox="0 0 200 200"
      className="mx-auto size-[150px] overflow-visible"
    >
      <defs>
        <linearGradient id="insignia-fire" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#ffe08a" />
          <stop offset="32%" stopColor="#ffa53d" />
          <stop offset="68%" stopColor="#ff6b1a" />
          <stop offset="100%" stopColor="#8f1c06" />
        </linearGradient>
        <linearGradient id="insignia-fire-alt" x1="1" y1="1" x2="0.8" y2="0">
          <stop offset="0%" stopColor="#fff0b8" />
          <stop offset="40%" stopColor="#ff8a3d" />
          <stop offset="100%" stopColor="#b52309" />
        </linearGradient>
        <radialGradient id="insignia-aura">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.5" />
          <stop offset="42%" stopColor="#ff6b1a" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#ff3c00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {INSIGNIA.orbitals.map((orbital) => (
        <g
          key={orbital.id}
          className={`orbital-${orbital.id}`}
          style={{ transformBox: "view-box", transformOrigin: "center" }}
        >
          <circle
            cx="100"
            cy="100"
            r={orbital.radius}
            fill="none"
            stroke={`url(#${orbital.gradient})`}
            strokeWidth={orbital.width}
            strokeDasharray={orbital.dash}
            opacity={orbital.opacity}
          />
          <circle
            cx="100"
            cy={100 - orbital.radius}
            r={orbital.node}
            fill={`url(#${orbital.gradient})`}
          />
        </g>
      ))}

      <circle
        className="insignia-aura"
        cx="100"
        cy="100"
        r="46"
        fill="url(#insignia-aura)"
        style={{ transformBox: "view-box", transformOrigin: "center" }}
      />

      <path
        className="insignia-core"
        d="M100 76 L119 111 L81 111 Z"
        fill="url(#insignia-fire)"
        style={{
          filter:
            "drop-shadow(0 0 8px rgba(255,107,26,.85)) drop-shadow(0 0 20px rgba(255,60,0,.5))",
        }}
      />
    </svg>
  );
}
