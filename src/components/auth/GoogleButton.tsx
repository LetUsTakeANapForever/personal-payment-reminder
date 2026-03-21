"use client";

import { Theme } from "@/types/authTypes";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth/auth-client";

function GoogleButton({ t }: { t: Theme }) {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social(
        {
          provider: "google",
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: error => {
            console.error("Google sign-in error:", error);
          },
        },
      );
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div style={{ marginBottom: 28 }}>
      <button
        onClick={handleGoogleSignIn}
        style={{
          width: "100%",
          padding: "11px 0",
          borderRadius: 10,
          border: `1.5px solid ${t.inputBorder}`,
          background: "transparent",
          color: t.text,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
          transition: "border 0.3s, background 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = t.accentGlow;
          e.currentTarget.style.borderColor = t.accent;
        }}
        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = t.inputBorder;
        }}
      >
        <svg width="16" height="16" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.1 24.1 0 000 21.56l7.98-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}
export default GoogleButton;
