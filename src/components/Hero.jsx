/* ────────────────────────────────────────────────────────────────────── */
/* GeometricHero — sport-specific hero with court lines & shuttle trails */
/* ────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef } from "react";
import { FONT_HEADING, FONT_BODY, INK, ACCENT } from "../lib/tokens.js";
import { FadeIn, GhostButton } from "./ui.jsx";

/* ── Court diagram background ────────────────────────────────────────── */
function CourtLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.05 }}
    >
      <rect x="140" y="90" width="920" height="620" stroke={INK} strokeWidth="1.5" fill="none" />
      <line x1="140" y1="400" x2="1060" y2="400" stroke={ACCENT} strokeWidth="2" />
      <line x1="140" y1="230" x2="1060" y2="230" stroke={INK} strokeWidth="1" />
      <line x1="140" y1="570" x2="1060" y2="570" stroke={INK} strokeWidth="1" />
      <line x1="600" y1="90" x2="600" y2="710" stroke={INK} strokeWidth="1" />
      <line x1="240" y1="90" x2="240" y2="710" stroke={INK} strokeWidth="1" />
      <line x1="960" y1="90" x2="960" y2="710" stroke={INK} strokeWidth="1" />
    </svg>
  );
}

/* ── Animated shuttle trajectory arc ──────────────────────────────────── */
function ShuttleTrail({ d, delay = 0, className = "", width = 500, height = 260, strokeWidth = 1.5, opacity = 0.4 }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;
    const t = setTimeout(() => {
      el.style.transition = "stroke-dashoffset 2200ms cubic-bezier(0.23,0.86,0.39,0.96)";
      el.style.strokeDashoffset = "0";
    }, delay * 1000 + 50);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <svg
      className={`absolute ${className}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ animation: "shapeFloat 14s ease-in-out infinite" }}
    >
      <path ref={pathRef} d={d} stroke={ACCENT} strokeWidth={strokeWidth} strokeOpacity={opacity} strokeLinecap="round" />
    </svg>
  );
}

export default function GeometricHero({ onOpenModal }) {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white"
    >
      <CourtLines />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ShuttleTrail
          delay={0.35}
          width={560}
          height={280}
          opacity={0.4}
          d="M10 260 Q 280 -60 550 220"
          className="left-[-8%] md:left-[-4%] top-[8%] md:top-[10%]"
        />
        <ShuttleTrail
          delay={0.55}
          width={380}
          height={200}
          opacity={0.3}
          d="M370 10 Q 140 140 10 190"
          className="right-[-4%] md:right-[2%] bottom-[10%] md:bottom-[14%]"
        />
        <ShuttleTrail
          delay={0.7}
          width={260}
          height={150}
          opacity={0.35}
          strokeWidth={1.25}
          d="M10 20 Q 130 90 250 30"
          className="left-[10%] md:left-[16%] bottom-[6%] md:bottom-[8%]"
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 text-center">
        <FadeIn delay={500}>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10"
            style={{ background: "rgba(10,10,10,0.03)", border: "1px solid rgba(10,10,10,0.08)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
            <span
              className="text-xs uppercase tracking-[0.25em]"
              style={{ fontFamily: FONT_BODY, fontWeight: 500, color: "rgba(10,10,10,0.6)" }}
            >
              Mastery, by invitation.
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={700}>
          <h1
            className="text-5xl sm:text-7xl md:text-8xl leading-[1.12] mb-8"
            style={{ fontFamily: FONT_HEADING, fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            <span className="block" style={{ color: INK }}>Racquets Cult</span>
            <span
              className="block bg-clip-text text-transparent pb-2"
              style={{ backgroundImage: `linear-gradient(90deg, ${INK} 0%, ${ACCENT} 50%, ${INK} 100%)` }}
            >
              Private Coaching
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={900}>
          <p
            className="text-base sm:text-lg mb-10 max-w-xl mx-auto"
            style={{ fontFamily: FONT_BODY, fontWeight: 300, lineHeight: 1.8, color: "rgba(10,10,10,0.5)" }}
          >
            Rc's is a private badminton coaching practice for players who
            train in silence and win in public.
          </p>
        </FadeIn>

        <FadeIn delay={1100}>
          <GhostButton onClick={onOpenModal}>Request An Invitation</GhostButton>
        </FadeIn>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, #FFFFFF, transparent, rgba(255,255,255,0.7))" }}
      />
    </section>
  );
}
