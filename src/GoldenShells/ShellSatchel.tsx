import { useEffect, useRef, useState } from "react";
import { useGoldenShells } from "./GoldenShellsProvider";

export function ShellSatchel() {
  const { totalEarned, lastEvent, clearLastEvent, setSatchelEl } =
    useGoldenShells();
  const [pulse, setPulse] = useState(false);
  const satchelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSatchelEl(satchelRef.current);
  }, [setSatchelEl]);

  useEffect(() => {
    if (lastEvent?.type === "shellEarned") {
      setPulse(true);
      const t = window.setTimeout(() => setPulse(false), 900);
      const t2 = window.setTimeout(() => clearLastEvent(), 1200);
      return () => {
        window.clearTimeout(t);
        window.clearTimeout(t2);
      };
    }
  }, [lastEvent, clearLastEvent]);

  return (
    <div
      ref={satchelRef}
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(6px)",
        pointerEvents: "none",
        transform: pulse ? "scale(1.05)" : "scale(1)",
        transition: "transform 300ms ease, box-shadow 300ms ease",
        boxShadow: pulse ? "0 0 0 2px rgba(255,215,120,0.35)" : "none",
      }}
    >
      <span style={{ fontSize: 18 }}>🎒</span>
      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.92)" }}>
        🐚 {totalEarned}
      </span>
    </div>
  );
}
