/* ────────────────────────────────────────────────────────────────────── */
/* Registration Modal — accessible, focus-trapped, Supabase-connected   */
/* ────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { FONT_HEADING, FONT_BODY, INK, MUTED, ACCENT } from "../lib/tokens.js";
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

    // Save trigger element for focus restoration on close
    lastActiveElementRef.current = document.activeElement;

    // Initial focus on first interactive element inside modal
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

    // Keyboard handling: Escape to close, Tab / Shift+Tab to trap focus
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
        className="absolute inset-0 bg-[#0A0A0A]/70 transition-opacity duration-500"
        style={{ opacity: mounted ? 1 : 0 }}
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md bg-white"
        style={{
          border: `1px solid ${INK}`,
          opacity: mounted ? 1 : 0,
          transition: "opacity 500ms ease-out",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 hover:opacity-60 transition-opacity duration-300"
          style={{ color: INK }}
        >
          <X size={18} strokeWidth={1.25} />
        </button>

        <div className="px-8 py-12 sm:px-12 sm:py-16">
          {submitted ? (
            <div className="py-10 text-center" role="status" aria-live="polite">
              <p
                className="text-[11px] uppercase tracking-[0.3em] mb-6"
                style={{ fontFamily: FONT_BODY, color: ACCENT }}
              >
                Application Received
              </p>
              <h3
                id="modal-title"
                className="text-3xl mb-5"
                style={{ fontFamily: FONT_HEADING, fontWeight: 700, letterSpacing: "-0.02em", color: INK }}
              >
                You're on the list.
              </h3>
              <p
                className="text-base"
                style={{ fontFamily: FONT_BODY, fontWeight: 300, lineHeight: 1.8, color: MUTED }}
              >
                Rc reviews every application personally. Expect a reply within
                72 hours if a seat is available for your standing.
              </p>
            </div>
          ) : (
            <>
              <p
                className="text-[11px] uppercase tracking-[0.3em] mb-5"
                style={{ fontFamily: FONT_BODY, color: ACCENT }}
              >
                Request An Invitation
              </p>
              <h3
                id="modal-title"
                className="text-3xl sm:text-4xl mb-4"
                style={{ fontFamily: FONT_HEADING, fontWeight: 700, letterSpacing: "-0.02em", color: INK }}
              >
                Apply for membership
              </h3>
              <p
                className="text-base mb-10"
                style={{ fontFamily: FONT_BODY, fontWeight: 300, lineHeight: 1.8, color: MUTED }}
              >
                Seats are limited each season. Tell us a little about you.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
                    className="block text-[11px] uppercase tracking-[0.2em] mb-2"
                    style={{ fontFamily: FONT_BODY, color: MUTED }}
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
                    className="w-full bg-transparent text-sm py-2 focus:outline-none appearance-none"
                    style={{ fontFamily: FONT_BODY, color: INK, borderBottom: `1px solid ${fieldErrors.tier ? "#B3413E" : INK}` }}
                  >
                    <option value="" disabled>Select a tier</option>
                    {TIERS.map((t) => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                  {fieldErrors.tier && (
                    <p id="modal-tier-error" className="text-[11px] mt-1.5" style={{ fontFamily: FONT_BODY, color: "#B3413E" }}>
                      {fieldErrors.tier}
                    </p>
                  )}
                </div>

                <div className="pt-6">
                  <GhostButton className="w-full justify-center" disabled={submitting}>
                    {submitting ? "Sending…" : "Submit Application"}
                  </GhostButton>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="text-center text-[11px] uppercase tracking-[0.15em] pt-1"
                    style={{ fontFamily: FONT_BODY, color: "#B3413E" }}
                  >
                    Something went wrong — please try again, or email
                    rcsbadminton@gmail.com directly.
                  </p>
                )}

                <p
                  className="text-center text-[11px] uppercase tracking-[0.15em] pt-2"
                  style={{ fontFamily: FONT_BODY, color: "#A3A3A3" }}
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
