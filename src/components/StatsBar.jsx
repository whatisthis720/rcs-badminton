/* ────────────────────────────────────────────────────────────────────── */
/* StatsBar — real credentials only, no invented numbers                 */
/* ────────────────────────────────────────────────────────────────────── */

import React from "react";
import { FONT_HEADING, FONT_BODY, INK, MUTED } from "../lib/tokens.js";
import { STATS } from "../lib/data.js";
import { FadeIn } from "./ui.jsx";

export default function StatsBar() {
  return (
    <section className="bg-white py-10 sm:py-12" style={{ borderTop: `1px solid ${INK}`, borderBottom: `1px solid ${INK}` }}>
      <div className="max-w-6xl mx-auto px-8 sm:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {STATS.map((s, i) => (
          <FadeIn key={s.label} delay={i * 100} className="text-center md:text-left">
            <div
              className="text-2xl sm:text-3xl mb-1"
              style={{ fontFamily: FONT_HEADING, fontWeight: 700, letterSpacing: "-0.02em", color: INK }}
            >
              {s.value}
            </div>
            <div
              className="text-[11px] uppercase tracking-[0.15em]"
              style={{ fontFamily: FONT_BODY, fontWeight: 500, color: MUTED }}
            >
              {s.label}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
