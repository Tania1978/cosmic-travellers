import { useState } from "react";
import { useGoldenShells } from "./GoldenShellsProvider";

export function GoldenShellModal() {
  const {
    activeOpportunity,
    isModalOpen,
    closeModal,
    submitAnswer,
    isShellEarned,
  } = useGoldenShells();
  const [feedback, setFeedback] = useState<string | null>(null);

  const opp = activeOpportunity;

  const visible = isModalOpen && opp && !isShellEarned(opp.id);
  if (!visible) return null;

  const onPick = (choiceId: string) => {
    const res = submitAnswer(choiceId);
    if (res.correct) {
      setFeedback("✨ A Golden Shell appears!");
      // Close gently after a short pause
      window.setTimeout(() => {
        setFeedback(null);
        closeModal();
      }, 650);
    } else {
      setFeedback("Let’s look again. What did we learn together?");
      window.setTimeout(() => setFeedback(null), 1200);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "rgba(0,0,0,0.35)",
        pointerEvents: "auto",
      }}
      onClick={closeModal}
    >
      <div
        style={{
          width: "min(720px, calc(100vw - 48px))",
          borderRadius: 20,
          padding: 18,
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
        >
          <div style={{ fontWeight: 700 }}>🐚 Golden Shell Discovery</div>
          <button
            onClick={closeModal}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 18,
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div style={{ marginTop: 10, fontSize: 18, lineHeight: 1.35 }}>
          {opp.question}
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {opp.choices.map((c) => (
            <button
              key={c.id}
              onClick={() => onPick(c.id)}
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.10)",
                background: "white",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 16,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {feedback && (
          <div
            style={{ marginTop: 12, fontSize: 14, color: "rgba(0,0,0,0.70)" }}
          >
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}
