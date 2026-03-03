import styled, { keyframes } from "styled-components";
import { useGoldenShells } from "./GoldenShellsProvider";

export function GoldenShellIcon() {
  const { activeOpportunity, isShellEarned, openModal } = useGoldenShells();

  if (!activeOpportunity) return null;
  if (isShellEarned(activeOpportunity.id)) return null;

  return (
    <ShellButton
      onClick={openModal}
      aria-label="Golden Shell"
      title="Golden Shell"
    >
      <Img src="/ui/golden-shell.png" alt="" draggable={false} />
    </ShellButton>
  );
}

export const pulseGlow = keyframes`
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 6px rgba(255, 215, 120, 0.35));
  }
  50% {
    transform: scale(1.2);
    filter:
      drop-shadow(0 0 16px rgba(255, 220, 140, 0.65))
      drop-shadow(0 0 26px rgba(255, 200, 90, 0.45));
  }
`;

export const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;

  /* Keep transitions for hover override */
  transition:
    transform 0.6s ease,
    filter 0.6s ease;

  /* ✅ Gentle always-on pulse */
  animation: ${pulseGlow} 2.8s ease-in-out infinite;
`;

const ShellButton = styled.button`
  position: absolute;
  z-index: 210;
  pointer-events: auto; /* because parent is pointerEvents none */
  top: 16px;
  left: 50%;
  transform: translateX(-50%); /* 🔥 true horizontal center */
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
  cursor: pointer;
  pointer-events: auto;
  padding: 0;

  transition: transform 0.6s ease;

  /* Accessibility: respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    ${Img} {
      animation: none;
    }
  }
`;
