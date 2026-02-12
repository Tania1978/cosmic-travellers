import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { sendMagicLink } from "./sendMagicLink";
import { GoogleLogin } from "@react-oauth/google";

type ParentAuthModalProps = {
  open: boolean;
  onClose: () => void;
  reason?: "unlock" | "login";
};

export default function ParentAuthModal({
  open,
  onClose,
  reason = "login",
}: ParentAuthModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const loginWithEmailLink = async () => {
    setErrorMsg(null);
    setStatus("sending");
    try {
      await sendMagicLink(email.trim());
      setStatus("sent");
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e?.message ?? "Could not send email link.");
    }
  };

  return (
    <div style={styles.backdrop} role="dialog" aria-modal="true">
      <div style={styles.modal}>
        <div style={styles.headerRow}>
          <h3 style={{ margin: 0, color: "white" }}>For parents</h3>
          <button onClick={onClose} style={styles.xButton} aria-label="Close">
            ✕
          </button>
        </div>

        <p style={{ marginTop: 8, marginBottom: 16, color: "white" }}>
          {reason === "unlock"
            ? "To unlock books (and keep them on all devices), a parent signs in."
            : "Sign in to restore your library and purchases."}
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              theme="outline"
              size="medium"
              width="250"
              onSuccess={async (cred) => {
                const { error } = await supabase.auth.signInWithIdToken({
                  provider: "google",
                  token: cred.credential!,
                });
                if (error) console.error(error);
              }}
              onError={() => {
                console.error("Google Login Failed");
              }}
            />
          </div>
          <div style={styles.dividerRow}>
            <div style={styles.divider} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.divider} />
          </div>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.8, color: "white" }}>
              Email link
            </span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@email.com"
              style={styles.input}
              inputMode="email"
              autoComplete="email"
            />
          </label>

          <button
            onClick={loginWithEmailLink}
            disabled={!email.trim() || status === "sending"}
            style={styles.secondaryButton}
          >
            {status === "sending" ? "Sending…" : "Send magic link"}
          </button>

          {status === "sent" && (
            <div style={styles.success}>
              Link sent. Please check your email and open it on this device.
            </div>
          )}

          {!!errorMsg && <div style={styles.error}>{errorMsg}</div>}
        </div>

        <p
          style={{ marginTop: 14, fontSize: 12, opacity: 0.75, color: "white" }}
        >
          You can continue exploring without signing in — signing in is only
          needed to unlock books.
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 9999,
  },
  modal: {
    width: "min(520px, 100%)",
    borderRadius: 16,
    backgroundImage: "url('/ui/bg5.jpg')",
    padding: 30,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  xButton: {
    border: "none",
    background: "transparent",
    fontSize: 18,
    cursor: "pointer",
    lineHeight: 1,
    color: "white",
  },
  primaryButton: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    fontWeight: 700,
  },
  input: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #ccc",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "6px 0",
  },
  divider: { flex: 1, height: 1, background: "#e6e6e6" },
  dividerText: { fontSize: 12, opacity: 0.7 },
  success: {
    fontSize: 13,
    padding: 10,
    borderRadius: 12,
    background: "#f2fbf2",
  },
  error: { fontSize: 13, padding: 10, borderRadius: 12, background: "#fff2f2" },
};
