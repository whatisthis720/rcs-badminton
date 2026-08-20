/**
 * Rc's — Racquets Cult
 * Kinetic Athletic Redesign: Charcoal (#0B0F14), Volt (#C8FF3D), Steel Blue (#1E88E5)
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
    <div className="bg-[#0B0F14] text-white min-h-screen relative selection:bg-[#C8FF3D] selection:text-[#0B0F14]">
      <style>{`
        html {
          scroll-behavior: smooth;
          background-color: #0B0F14;
        }
        @keyframes shapeFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(15px); }
        }
        * { border-radius: 0 !important; }
        a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible {
          outline: 1.5px solid #C8FF3D;
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
