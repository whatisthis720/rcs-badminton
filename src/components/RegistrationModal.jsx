/* ────────────────────────────────────────────────────────────────────── */
/* Registration Modal — Kinetic Athletic Redesign                         */
/* Accessible, focus-trapped, Supabase-connected                          */
/* ────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { FONT_HEADING, FONT_BODY, PAPER, MUTED_DARK, VOLT, STEEL, CHARCOAL } from "../lib/tokens.js";
import { TIERS } from "../lib/data.js";
import { supabase } from "../lib/supabaseClient.js";
import { GhostButton, Field } from "./ui.jsx";

export default function RegistrationModal({ open, onClose, presetTier }) {
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", tier: presetTier || "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const modalRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setError(false);
      setFieldErrors({});
      setForm({ name: "", email: "", phone: "", tier: presetTier || "" });
      const t = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(t);
    } else {
      setMounted(false);
    }
  }, [open, presetTier]);

  useEffect(() => {
    if (!open) return;

    lastActiveElementRef.current = document.activeElement;

    const focusTimer = setTimeout(() => {
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!modalRef.current) return;
        const focusables = Array.from(
          modalRef.current.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
          )
        );

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === "function") {
        lastActiveElementRef.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Enter your full name";
    if (!form.email.trim()) errs.email = "Enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.phone.trim()) errs.phone = "Enter your phone number";
    else if (form.phone.replace(/\D/g, "").length < 7) errs.phone = "Enter a valid phone number";
    if (!form.tier) errs.tier = "Select a standing";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError(false);
    try {
      if (!supabase) {
        throw new Error("Supabase client is not configured");
      }
      const today = new Date().toISOString().split("T")[0];
      const payload = {
        student_name: form.name.trim(),
        student_phone: form.phone.trim(),
        student_email: form.email.trim(),
        membership_tier: form.tier,
        session_date: today,
        session_time: "09:00:00",
        status: "pending",
      };
      const { error: insertError } = await supabase.from("bookings").insert([payload]);
      if (insertError) {
        setError(true);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0B0F14]/85 backdrop-blur-sm transition-opacity duration-400"
        style={{ opacity: mounted ? 1 : 0 }}
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md bg-[#0E131A] text-white"
        style={{
          border: "1px solid rgba(200, 255, 61, 0.35)",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(200, 255, 61, 0.15)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "scale(1)" : "scale(0.96)",
          transition: "opacity 300ms ease-out, transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 p-2 text-[#B8BEC7] hover:text-[#C8FF3D] transition-colors"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        <div className="px-8 py-10 sm:px-10 sm:py-12">
          {submitted ? (
            <div className="py-8 text-center" role="status" aria-live="polite">
              <div className="w-12 h-12 rounded-full bg-[#C8FF3D]/10 border border-[#C8FF3D] text-[#C8FF3D] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(200,255,61,0.3)]">
                ✓
              </div>
              <p
                className="text-xs uppercase tracking-[0.3em] font-bold mb-3 text-[#C8FF3D]"
                style={{ fontFamily: FONT_BODY }}
              >
                Application Received
              </p>
              <h3
                id="modal-title"
                className="text-2xl sm:text-3xl mb-4 font-extrabold text-white tracking-tight"
                style={{ fontFamily: FONT_HEADING }}
              >
                You're on the list.
              </h3>
              <p
                className="text-sm font-normal text-[#B8BEC7] leading-relaxed"
                style={{ fontFamily: FONT_BODY }}
              >
                Rc reviews every application personally. Expect a reply within
                72 hours if a seat is available for your standing.
              </p>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8FF3D]/10 border border-[#C8FF3D]/30 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF3D] shadow-[0_0_6px_#C8FF3D]" />
                <p
                  className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#C8FF3D]"
                  style={{ fontFamily: FONT_BODY }}
                >
                  Request An Invitation
                </p>
              </div>

              <h3
                id="modal-title"
                className="text-2xl sm:text-3xl mb-2 font-black text-white tracking-tight"
                style={{ fontFamily: FONT_HEADING }}
              >
                Apply for membership
              </h3>
              <p
                className="text-xs text-[#B8BEC7] font-normal leading-relaxed mb-8"
                style={{ fontFamily: FONT_BODY }}
              >
                Seats are limited each season. Tell us a little about you.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <Field
                  id="modal-name"
                  label="Full name"
                  type="text"
                  placeholder="Your name"
                  required
                  value={form.name}
                  error={fieldErrors.name}
                  onChange={(v) => {
                    setForm((f) => ({ ...f, name: v }));
                    if (fieldErrors.name) setFieldErrors((f) => ({ ...f, name: undefined }));
                  }}
                />
                <Field
                  id="modal-email"
                  label="Email"
                  type="email"
                  placeholder="you@email.com"
                  required
                  value={form.email}
                  error={fieldErrors.email}
                  onChange={(v) => {
                    setForm((f) => ({ ...f, email: v }));
                    if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
                  }}
                />
                <Field
                  id="modal-phone"
                  label="Phone"
                  type="tel"
                  placeholder="+91 00000 00000"
                  required
                  value={form.phone}
                  error={fieldErrors.phone}
                  onChange={(v) => {
                    setForm((f) => ({ ...f, phone: v }));
                    if (fieldErrors.phone) setFieldErrors((f) => ({ ...f, phone: undefined }));
                  }}
                />

                <div>
                  <label
                    htmlFor="modal-tier"
                    className="block text-[11px] uppercase tracking-[0.2em] mb-2 font-medium text-[#B8BEC7]"
                    style={{ fontFamily: FONT_BODY }}
                  >
                    Preferred Standing
                  </label>
                  <select
                    id="modal-tier"
                    value={form.tier}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, tier: e.target.value }));
                      if (fieldErrors.tier) setFieldErrors((f) => ({ ...f, tier: undefined }));
                    }}
                    aria-invalid={!!fieldErrors.tier}
                    aria-describedby={fieldErrors.tier ? "modal-tier-error" : undefined}
                    className="w-full bg-[#131922] text-sm text-white px-4 py-3 rounded-none focus:outline-none transition-all duration-200 border border-white/10 appearance-none"
                    style={{
                      fontFamily: FONT_BODY,
                      border: `1px solid ${fieldErrors.tier ? "#FF4B4B" : "rgba(255, 255, 255, 0.12)"}`,
                    }}
                  >
                    <option value="" disabled>Select a tier</option>
                    {TIERS.map((t) => (
                      <option key={t.name} value={t.name} className="bg-[#0E131A] text-white">{t.name}</option>
                    ))}
                  </select>
                  {fieldErrors.tier && (
                    <p id="modal-tier-error" className="text-[11px] mt-1.5 font-medium text-[#FF4B4B]" style={{ fontFamily: FONT_BODY }}>
                      {fieldErrors.tier}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <GhostButton className="w-full justify-center !py-4 font-bold text-sm" disabled={submitting}>
                    {submitting ? "Sending…" : "Submit Application"}
                  </GhostButton>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="text-center text-[11px] uppercase tracking-[0.15em] pt-1 font-semibold text-[#FF4B4B]"
                    style={{ fontFamily: FONT_BODY }}
                  >
                    Something went wrong — please try again, or email
                    rcsbadminton@gmail.com directly.
                  </p>
                )}

                <p
                  className="text-center text-[11px] uppercase tracking-[0.15em] pt-2 text-[#64748B]"
                  style={{ fontFamily: FONT_BODY }}
                >
                  Applications reviewed weekly · Seats limited per season
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
