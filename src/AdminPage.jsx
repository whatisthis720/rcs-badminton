import React, { useEffect, useState, useCallback } from "react";
import { supabase, supabaseConfigured } from "./lib/supabaseClient.js";
import { FONT_HEADING, FONT_BODY, INK, PAPER, MUTED, ACCENT } from "./lib/tokens.js";

const EMPTY_FORM = {
  student_name: "",
  student_phone: "",
  student_email: "",
  membership_tier: "Individual",
  session_date: "",
  session_time: "",
  status: "pending",
  notes: "",
};

function GhostButton({ children, onClick, type = "button", disabled = false, danger = false }) {
  const hoverClass = danger
    ? "hover:border-[#B3413E] hover:text-[#B3413E]"
    : "hover:border-[#C5A059] hover:text-[#C5A059]";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center border border-[#0A0A0A] text-[#0A0A0A] bg-transparent ${disabled ? "opacity-50 cursor-not-allowed" : `cursor-pointer ${hoverClass}`} transition-all duration-200`}
      style={{
        fontFamily: FONT_BODY,
        fontWeight: 500,
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        padding: "10px 20px",
      }}
    >
      {children}
    </button>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: FONT_BODY,
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: MUTED,
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      <input
        {...props}
        style={{
          width: "100%",
          fontFamily: FONT_BODY,
          fontSize: "14px",
          padding: "8px 0",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${INK}`,
          outline: "none",
          color: INK,
        }}
      />
    </div>
  );
}

function SetupNeeded() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: PAPER,
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "440px" }}>
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: "26px",
            letterSpacing: "-0.02em",
            color: INK,
            marginBottom: "16px",
          }}
        >
          Database Not Connected
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: "14px", lineHeight: 1.7, color: MUTED }}>
          This deployment is missing its Supabase configuration. Copy{" "}
          <code style={{ color: INK }}>.env.example</code> to <code style={{ color: INK }}>.env</code>{" "}
          and fill in your project URL and anon key (or, if deployed, add{" "}
          <code style={{ color: INK }}>VITE_SUPABASE_URL</code> and{" "}
          <code style={{ color: INK }}>VITE_SUPABASE_ANON_KEY</code> in your hosting provider's
          environment variable settings) — see the README for the full setup steps.
        </p>
      </div>
    </div>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: PAPER,
        padding: "24px",
      }}
    >
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "360px" }}>
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: "28px",
            letterSpacing: "-0.02em",
            color: INK,
            marginBottom: "8px",
          }}
        >
          Rc's — Admin
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: "13px", color: MUTED, marginBottom: "32px" }}>
          Sign in to manage the booking schedule.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && (
          <p style={{ fontFamily: FONT_BODY, fontSize: "12px", color: "#B3413E", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        <GhostButton type="submit" disabled={loading}>
          {loading ? "Signing In…" : "Sign In"}
        </GhostButton>
      </form>
    </div>
  );
}

function BookingForm({ onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      student_name: form.student_name.trim(),
      student_phone: form.student_phone.trim(),
      student_email: form.student_email.trim() || null,
      notes: form.notes.trim() || null,
    };
    const { error } = await supabase.from("bookings").insert([payload]);
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setForm(EMPTY_FORM);
      onSaved();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: `1px solid ${INK}`,
        padding: "24px",
        marginBottom: "40px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "20px",
        alignItems: "end",
      }}
    >
      <Input label="Student Name" required value={form.student_name} onChange={set("student_name")} />
      <Input label="Phone" required value={form.student_phone} onChange={set("student_phone")} />
      <Input label="Email (optional)" type="email" value={form.student_email} onChange={set("student_email")} />

      <div>
        <label style={{ display: "block", fontFamily: FONT_BODY, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: MUTED, marginBottom: "6px" }}>
          Tier
        </label>
        <select
          value={form.membership_tier}
          onChange={set("membership_tier")}
          style={{ width: "100%", fontFamily: FONT_BODY, fontSize: "14px", padding: "8px 0", background: "transparent", border: "none", borderBottom: `1px solid ${INK}`, outline: "none", color: INK }}
        >
          <option value="Individual">Individual</option>
          <option value="Group">Group</option>
        </select>
      </div>

      <Input label="Session Date" type="date" required value={form.session_date} onChange={set("session_date")} />
      <Input label="Session Time" type="time" required value={form.session_time} onChange={set("session_time")} />

      <div>
        <label style={{ display: "block", fontFamily: FONT_BODY, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: MUTED, marginBottom: "6px" }}>
          Status
        </label>
        <select
          value={form.status}
          onChange={set("status")}
          style={{ width: "100%", fontFamily: FONT_BODY, fontSize: "14px", padding: "8px 0", background: "transparent", border: "none", borderBottom: `1px solid ${INK}`, outline: "none", color: INK }}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <Input label="Notes (optional)" value={form.notes} onChange={set("notes")} />

      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {error && <p style={{ fontFamily: FONT_BODY, fontSize: "12px", color: "#B3413E" }}>{error}</p>}
        <div style={{ marginLeft: "auto" }}>
          <GhostButton type="submit" disabled={saving}>
            {saving ? "Saving…" : "Add Booking"}
          </GhostButton>
        </div>
      </div>
    </form>
  );
}

function BookingRow({ booking, onChanged }) {
  const [updating, setUpdating] = useState(false);
  const [rowError, setRowError] = useState("");

  const updateStatus = async (status) => {
    setUpdating(true);
    setRowError("");
    const { error } = await supabase.from("bookings").update({ status }).eq("id", booking.id);
    setUpdating(false);
    if (error) setRowError(error.message);
    else onChanged();
  };

  const remove = async () => {
    if (!window.confirm(`Delete booking for ${booking.student_name}?`)) return;
    setUpdating(true);
    setRowError("");
    const { error } = await supabase.from("bookings").delete().eq("id", booking.id);
    setUpdating(false);
    if (error) setRowError(error.message);
    else onChanged();
  };

  const statusColor = booking.status === "confirmed" ? "#3A7D44" : booking.status === "cancelled" ? "#B3413E" : ACCENT;

  return (
    <tr style={{ borderBottom: `1px solid rgba(10,10,10,0.1)`, opacity: updating ? 0.5 : 1 }}>
      <td style={cellStyle}>{booking.session_date}</td>
      <td style={cellStyle}>{booking.session_time?.slice(0, 5)}</td>
      <td style={cellStyle}>
        <div style={{ fontWeight: 500 }}>{booking.student_name}</div>
        <div style={{ color: MUTED, fontSize: "12px" }}>{booking.student_phone}</div>
      </td>
      <td style={cellStyle}>{booking.membership_tier}</td>
      <td style={cellStyle}>
        <select
          value={booking.status}
          onChange={(e) => updateStatus(e.target.value)}
          disabled={updating}
          style={{ fontFamily: FONT_BODY, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: statusColor, background: "transparent", border: `1px solid ${statusColor}`, padding: "4px 8px" }}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {rowError && <div style={{ color: "#B3413E", fontSize: "11px", marginTop: "4px" }}>{rowError}</div>}
      </td>
      <td style={{ ...cellStyle, color: MUTED, fontSize: "12px" }}>{booking.notes}</td>
      <td style={cellStyle}>
        <button
          onClick={remove}
          disabled={updating}
          style={{ fontFamily: FONT_BODY, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#B3413E", background: "transparent", border: "none", cursor: "pointer" }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

const cellStyle = { padding: "14px 12px", fontFamily: FONT_BODY, fontSize: "13px", color: INK, verticalAlign: "top" };

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("session_date", { ascending: true })
      .order("session_time", { ascending: true });
    if (error) setLoadError(error.message);
    setBookings(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div style={{ minHeight: "100vh", background: PAPER, padding: "48px 32px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1 style={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: "28px", letterSpacing: "-0.02em", color: INK }}>
            Booking Schedule
          </h1>
          <GhostButton onClick={signOut}>Sign Out</GhostButton>
        </div>

        <BookingForm onSaved={load} />

        {loadError && (
          <p style={{ fontFamily: FONT_BODY, fontSize: "13px", color: "#B3413E", marginBottom: "20px" }}>
            Couldn't load bookings: {loadError}
          </p>
        )}

        {loading ? (
          <p style={{ fontFamily: FONT_BODY, color: MUTED }}>Loading…</p>
        ) : bookings.length === 0 ? (
          <p style={{ fontFamily: FONT_BODY, color: MUTED }}>No bookings yet. Add one above.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${INK}` }}>
                  {["Date", "Time", "Student", "Tier", "Status", "Notes", ""].map((h) => (
                    <th
                      key={h}
                      style={{ textAlign: "left", padding: "0 12px 10px", fontFamily: FONT_BODY, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: MUTED }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <BookingRow key={b.id} booking={b} onChanged={load} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = logged out

  useEffect(() => {
    if (!supabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) return <SetupNeeded />;
  if (session === undefined) return null; // brief flash while checking auth state
  return session ? <Dashboard /> : <LoginScreen />;
}
