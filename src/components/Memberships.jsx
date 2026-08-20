/* ────────────────────────────────────────────────────────────────────── */
/* Memberships — pricing tiers section                                   */
/* ────────────────────────────────────────────────────────────────────── */

import React from "react";
import { FONT_HEADING, FONT_BODY, INK, MUTED, ACCENT } from "../lib/tokens.js";
import { TIERS } from "../lib/data.js";
import { FadeIn, GhostButton } from "./ui.jsx";

export default function Memberships({ onOpenModal }) {
  return (
    <section id="memberships" className="bg-white pt-16 sm:pt-20 pb-16 sm:pb-20" style={{ borderTop: `1px solid ${INK}` }}>
      <div className="max-w-6xl mx-auto px-8 sm:px-12">
        <div className="max-w-2xl mb-24">
          <FadeIn>
            <p
              className="text-xs uppercase tracking-[0.35em] mb-8"
              style={{ fontFamily: FONT_BODY, fontWeight: 500, color: ACCENT }}
            >
              Memberships
            </p>
          </FadeIn>
          <FadeIn delay={150}>
            <h2
              className="text-5xl sm:text-6xl leading-[1.05] mb-8"
              style={{ fontFamily: FONT_HEADING, fontWeight: 800, letterSpacing: "-0.02em", color: INK }}
            >
              Two standings. One practice.
            </h2>
          </FadeIn>
          <FadeIn delay={300}>
            <p
              className="text-base"
              style={{ fontFamily: FONT_BODY, fontWeight: 300, lineHeight: 1.8, color: MUTED }}
            >
              Train alone, with Rc's full attention, or alongside a small
              group building the same foundation together.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2" style={{ borderTop: `1px solid ${INK}`, borderLeft: `1px solid ${INK}` }}>
          {TIERS.map((tier, i) => (
            <FadeIn key={tier.name} delay={i * 150}>
              <div
                className="h-full px-10 py-16 sm:px-16 sm:py-20 flex flex-col"
                style={{ borderRight: `1px solid ${INK}`, borderBottom: `1px solid ${INK}` }}
              >
                {tier.featured && (
                  <span
                    className="text-[11px] uppercase tracking-[0.2em] mb-8"
                    style={{ fontFamily: FONT_BODY, fontWeight: 600, color: ACCENT }}
                  >
                    Most Requested
                  </span>
                )}

                <h3
                  className="text-3xl mb-3"
                  style={{ fontFamily: FONT_HEADING, fontWeight: 700, letterSpacing: "-0.02em", color: INK }}
                >
                  {tier.name}
                </h3>

                <p
                  className="text-[11px] uppercase tracking-[0.15em] mb-4"
                  style={{ fontFamily: FONT_BODY, fontWeight: 600, color: INK }}
                >
                  {tier.capacity}
                </p>

                <p
                  className="text-sm mb-10"
                  style={{ fontFamily: FONT_BODY, fontWeight: 300, lineHeight: 1.8, color: MUTED }}
                >
                  {tier.tagline}
                </p>

                <div className="mb-2 flex items-baseline gap-2">
                  <span
                    className="text-3xl"
                    style={{ fontFamily: FONT_HEADING, fontWeight: 700, color: INK }}
                  >
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span
                      className="text-xs uppercase tracking-[0.1em]"
                      style={{ fontFamily: FONT_BODY, color: MUTED }}
                    >
                      {tier.period}
                    </span>
                  )}
                </div>
                <p
                  className="text-xs uppercase tracking-[0.1em] mb-10"
                  style={{ fontFamily: FONT_BODY, color: ACCENT }}
                >
                  {tier.sessions}
                </p>

                <ul className="space-y-4 mb-12 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-2.5 w-1 h-1 shrink-0" style={{ background: ACCENT }} />
                      <span
                        className="text-sm"
                        style={{ fontFamily: FONT_BODY, fontWeight: 300, lineHeight: 1.8, color: "#3A3A3A" }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <GhostButton onClick={() => onOpenModal(tier.name)} className="justify-center">
                  Request Invitation
                </GhostButton>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
