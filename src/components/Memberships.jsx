/* ────────────────────────────────────────────────────────────────────── */
/* Memberships — Kinetic Athletic Pricing & Standings                     */
/* ────────────────────────────────────────────────────────────────────── */

import React from "react";
import { FONT_HEADING, FONT_BODY, PAPER, MUTED_DARK, VOLT, STEEL, CHARCOAL } from "../lib/tokens.js";
import { TIERS } from "../lib/data.js";
import { FadeIn, GhostButton } from "./ui.jsx";

export default function Memberships({ onOpenModal }) {
  return (
    <section id="memberships" className="bg-[#0E131A] pt-20 sm:pt-28 pb-20 sm:pb-32 border-t border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none opacity-15"
        style={{
          background: "radial-gradient(ellipse at center, rgba(200, 255, 61, 0.2) 0%, rgba(30, 136, 229, 0.1) 50%, transparent 80%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-8 sm:px-12 relative z-10">
        <div className="max-w-3xl mb-20">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C8FF3D]/10 border border-[#C8FF3D]/30 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF3D] shadow-[0_0_8px_#C8FF3D]" />
              <p
                className="text-xs uppercase tracking-[0.3em] font-semibold text-[#C8FF3D]"
                style={{ fontFamily: FONT_BODY }}
              >
                Memberships
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <h2
              className="text-5xl sm:text-6xl md:text-7xl leading-[1.05] mb-6 font-black text-white tracking-tight"
              style={{ fontFamily: FONT_HEADING }}
            >
              Two standings. One practice.
            </h2>
          </FadeIn>

          <FadeIn delay={250}>
            <p
              className="text-base text-[#B8BEC7] font-normal leading-relaxed max-w-xl"
              style={{ fontFamily: FONT_BODY }}
            >
              Train alone, with Rc's full attention, or alongside a small
              group building the same foundation together.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {TIERS.map((tier, i) => (
            <FadeIn key={tier.name} delay={i * 150} direction="up" className="h-full">
              <div
                className={`h-full px-8 py-12 sm:px-12 sm:py-16 flex flex-col justify-between transition-all duration-500 bg-[#131A24] border relative group ${
                  tier.featured
                    ? "border-[#C8FF3D] shadow-[0_0_30px_rgba(200,255,61,0.15)] hover:shadow-[0_0_40px_rgba(200,255,61,0.25)]"
                    : "border-white/10 hover:border-[#1E88E5]/50 hover:shadow-[0_0_30px_rgba(30,136,229,0.15)]"
                }`}
                style={{
                  transform: "translateZ(0)",
                }}
              >
                <div>
                  {tier.featured ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8FF3D] text-[#0B0F14] text-[11px] uppercase tracking-[0.2em] font-bold mb-6">
                      Most Requested
                    </div>
                  ) : (
                    <div className="h-7 mb-6" />
                  )}

                  <h3
                    className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight"
                    style={{ fontFamily: FONT_HEADING }}
                  >
                    {tier.name}
                  </h3>

                  <p
                    className="text-[12px] uppercase tracking-[0.18em] font-semibold text-[#1E88E5] mb-4"
                    style={{ fontFamily: FONT_BODY }}
                  >
                    {tier.capacity}
                  </p>

                  <p
                    className="text-sm text-[#B8BEC7] font-normal leading-relaxed mb-8"
                    style={{ fontFamily: FONT_BODY }}
                  >
                    {tier.tagline}
                  </p>

                  <div className="mb-2 flex items-baseline gap-2">
                    <span
                      className="text-4xl font-black text-white tracking-tight"
                      style={{ fontFamily: FONT_HEADING }}
                    >
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span
                        className="text-xs uppercase tracking-[0.15em] font-medium text-[#B8BEC7]"
                        style={{ fontFamily: FONT_BODY }}
                      >
                        {tier.period}
                      </span>
                    )}
                  </div>

                  <p
                    className="text-xs uppercase tracking-[0.15em] font-semibold text-[#C8FF3D] mb-8"
                    style={{ fontFamily: FONT_BODY }}
                  >
                    {tier.sessions}
                  </p>

                  <ul className="space-y-4 mb-12">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="mt-2 w-1.5 h-1.5 shrink-0 bg-[#C8FF3D] rounded-full shadow-[0_0_6px_#C8FF3D]" />
                        <span
                          className="text-sm font-normal text-[#E2E8F0] leading-relaxed"
                          style={{ fontFamily: FONT_BODY }}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <GhostButton
                  onClick={() => onOpenModal(tier.name)}
                  variant={tier.featured ? "volt" : "steel"}
                  className="w-full justify-center text-center font-bold"
                >
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
