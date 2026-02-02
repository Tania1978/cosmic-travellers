import styled from "styled-components";
import { useGoldenShells } from "./GoldenShellsProvider";

export function GoldenShellIcon() {
  const { activeOpportunity, isShellEarned, openModal } = useGoldenShells();
  console.log(activeOpportunity);

  if (!activeOpportunity) return null;
  if (isShellEarned(activeOpportunity.id)) return null;

  return (
    <button
      onClick={openModal}
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 999,
        border: "none",
        background: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(6px)",
        cursor: "pointer",
        pointerEvents: "auto",
      }}
      aria-label="Golden Shell"
      title="Golden Shell"
    >
      <Img src={"/ui/golden-shell.png"} alt="" draggable={false} />

      <style>{`
        @keyframes shellPulse {
          0% { transform: translateY(0) scale(1); opacity: 0.92; }
          50% { transform: translateY(-2px) scale(1.03); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 0.92; }
        }
      `}</style>
    </button>
  );
}
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
`;
