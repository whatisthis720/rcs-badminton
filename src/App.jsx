/**
 * Rc's — Racquets Cult
 * Ultra-Minimalist Editorial landing page for a private badminton coaching practice.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TYPOGRAPHY — exactly two families, no exceptions
 * ─────────────────────────────────────────────────────────────────────────
 *   Headings → "Playfair Display", weight 700–800, letter-spacing -0.02em
 *   Body     → "Inter", 16px, line-height 1.8
 *
 * ─────────────────────────────────────────────────────────────────────────
 * A NOTE ON ANIMATION
 * ─────────────────────────────────────────────────────────────────────────
 * The brief asks for framer-motion. This file runs inside the Claude.ai
 * artifact sandbox, which ships a fixed set of libraries and does NOT
 * include framer-motion. To keep this actually runnable here, the fade-in
 * is implemented with native React + IntersectionObserver + a CSS opacity
 * transition — tuned to the same spec: 1.2s, opacity only, no slide, no
 * bounce, no easing tricks.
 *
 * If you're building this in your own project (Next.js/Vite) where
 * framer-motion IS installed, swap the <FadeIn> wrapper below for this:
 *
 *   import { motion } from "framer-motion";
 *   <motion.div
 *     initial={{ opacity: 0 }}
 *     whileInView={{ opacity: 1 }}
 *     viewport={{ once: true, amount: 0.2 }}
 *     transition={{ duration: 1.2, ease: "easeOut" }}
 *   >
 *     {children}
 *   </motion.div>
 *
 * ─────────────────────────────────────────────────────────────────────────
 * IMAGE PLACEHOLDERS
 * ─────────────────────────────────────────────────────────────────────────
 * Marked with {/* REPLACE IMAGE *\/} comments. Pulled from Picsum, pushed to
 * true monochrome (grayscale + higher contrast) to match the strict palette.
 * Swap for real, high-resolution photography — full-bleed, zero rounded
 * corners, sharply cropped to the grid, as specified.
 */

import React, { useEffect, useState, useCallback } from "react";
import Nav from "./components/Nav.jsx";
import GeometricHero from "./components/Hero.jsx";
import StatsBar from "./components/StatsBar.jsx";
import Philosophy from "./components/Philosophy.jsx";
import Memberships from "./components/Memberships.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Footer from "./components/Footer.jsx";
import RegistrationModal from "./components/RegistrationModal.jsx";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [presetTier, setPresetTier] = useState(null);

  const openModal = useCallback((tier) => {
    setPresetTier(tier || null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    document.body.classList.toggle("modal-open", modalOpen);
    return () => document.body.classList.remove("modal-open");
  }, [modalOpen]);

  return (
    <div className="bg-white min-h-screen relative">
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes shapeFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(15px); }
        }
        ::selection { background: #C5A059; color: #0A0A0A; }
        * { border-radius: 0 !important; }
        a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible {
          outline: 1px solid #C5A059;
          outline-offset: 3px;
        }
      `}</style>

      <Nav onOpenModal={() => openModal(null)} />
      <GeometricHero onOpenModal={() => openModal(null)} />
      <StatsBar />
      <Philosophy />
      <Memberships onOpenModal={openModal} />
      <Testimonials />
      <Footer onOpenModal={openModal} />

      <RegistrationModal open={modalOpen} onClose={closeModal} presetTier={presetTier} />
    </div>
  );
}
