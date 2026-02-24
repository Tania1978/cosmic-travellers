import { useEffect, useRef, useState } from "react";
import { useGoldenShells } from "./GoldenShellsProvider";
import styled from "styled-components";

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
        left: 16,
        top:10,
        marginBottom: 20, // 20px above the frame
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        padding: "12px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(6px)",
        pointerEvents: "none",
        transform: pulse ? "scale(1.05)" : "scale(1)",
        transition: "transform 300ms ease, box-shadow 300ms ease",
        boxShadow: pulse ? "0 0 0 2px rgba(255,215,120,0.35)" : "none",
        color: "white",
      }}
    >
      <Img
        src={"/ui/saschet.png"}
        alt=""
        draggable={false}
        style={{ width: "35px", height: "35px" }}
      />{" "}
      {totalEarned}
    </div>
  );
}
const Img = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
`;
