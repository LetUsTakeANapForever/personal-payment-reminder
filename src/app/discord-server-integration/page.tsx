"use client";

import { useState } from "react";

const C = {
  bg: "#0c0d10",
  bgCard: "#141519",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(255,255,255,0.12)",
  text: "#eae8e3",
  muted: "#6b6a66",
  blurple: "#5865F2",
  blurpleGlow: "rgba(88,101,242,0.3)",
  blurpleSoft: "rgba(88,101,242,0.12)",
  green: "#3cf08a",
  error: "#f06060",
};

const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const BellIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

function AddToDiscordServerPage() {
  const [serverId, setServerId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  const validate = (id: string): boolean => {
    if (!id.trim()) {
      setError("Server ID is required");
      return false;
    }
    if (!/^\d{17,20}$/.test(id.trim())) {
      setError("Enter a valid Discord server ID (17–20 digits)");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (validate(serverId)) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.bg,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />

        <div
          style={{
            width: 440,
            maxWidth: "90vw",
            textAlign: "center",
            background: C.bgCard,
            borderRadius: 20,
            border: `1px solid ${C.border}`,
            padding: "48px 36px",
            boxShadow: `0 24px 80px rgba(0,0,0,0.5)`,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              margin: "0 auto 20px",
              background: "rgba(60,240,138,0.1)",
              color: C.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.green}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.text,
              marginBottom: 8,
            }}
          >
            PayPing is on its way!
          </h2>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: C.muted,
              marginBottom: 6,
            }}
          >
            The bot will appear in your server shortly.
          </p>
          <p
            style={{
              fontSize: 13,
              color: C.muted,
              fontFamily: "'JetBrains Mono', monospace",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 8,
              padding: "8px 14px",
              display: "inline-block",
              marginTop: 12,
            }}
          >
            Server: {serverId}
          </p>
          <div style={{ marginTop: 28 }}>
            <button
              onClick={() => {
                setSubmitted(false);
                setServerId("");
              }}
              style={{
                padding: "11px 24px",
                borderRadius: 10,
                border: `1.5px solid ${C.border}`,
                background: "transparent",
                color: C.text,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "'Outfit', sans-serif",
                cursor: "pointer",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.borderColor = C.borderHover)
              }
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            >
              Add to another server
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
        fontFamily: "'Outfit', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        ::placeholder { color: ${C.muted}; opacity: 0.5; }
      `}</style>

      {/* ambient glow */}
      <div
        style={{
          position: "fixed",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.blurpleGlow} 0%, transparent 70%)`,
          top: "-10%",
          right: "-5%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: 440,
          maxWidth: "90vw",
          background: C.bgCard,
          borderRadius: 20,
          border: `1px solid ${C.border}`,
          padding: "44px 36px 36px",
          boxShadow: `0 24px 80px rgba(0,0,0,0.5)`,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* logo + title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              margin: "0 auto 16px",
              background: `linear-gradient(135deg, ${C.blurple}, #7b6cf6)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <BellIcon size={22} />
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: C.text,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            Add PayPing to your server
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
            Enter your Discord server ID and we'll set up payment reminders for
            you.
          </p>
        </div>

        {/* server id input */}
        <div style={{ marginBottom: 8 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              color: C.muted,
              marginBottom: 8,
              display: "block",
            }}
          >
            Server ID
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="e.g. 123456789012345678"
            value={serverId}
            onChange={e => {
              setServerId(e.target.value);
              if (error) setError("");
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => {
              if (e.key === "Enter") handleSubmit();
            }}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 15,
              fontFamily: "'JetBrains Mono', monospace",
              color: C.text,
              background: "rgba(255,255,255,0.04)",
              border: `1.5px solid ${error ? C.error : focused ? C.blurple : C.border}`,
              borderRadius: 10,
              outline: "none",
              transition: "border 0.3s, box-shadow 0.3s",
              boxShadow:
                focused && !error ? `0 0 0 3px ${C.blurpleGlow}` : "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* error */}
        {error && (
          <p
            style={{
              fontSize: 13,
              color: C.error,
              marginBottom: 8,
              marginTop: 4,
            }}
          >
            {error}
          </p>
        )}

        {/* helper text */}
        <p
          style={{
            fontSize: 12,
            color: C.muted,
            lineHeight: 1.6,
            marginBottom: 24,
            marginTop: error ? 4 : 8,
          }}
        >
          To find your server ID: open Discord → Settings → Advanced → enable
          Developer Mode → right-click your server → Copy Server ID.
        </p>

        {/* submit */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: C.blurple,
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "'Outfit', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: `0 4px 20px ${C.blurpleGlow}`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 8px 30px ${C.blurpleGlow}`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 4px 20px ${C.blurpleGlow}`;
          }}
        >
          <DiscordIcon size={18} /> Add to Server
        </button>

        {/* back link */}
        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 13,
            color: C.muted,
          }}
        >
          <a
            href="/"
            style={{
              color: C.blurple,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            ← Back to home
          </a>
        </p>
      </div>
    </div>
  );
}

export default AddToDiscordServerPage;
