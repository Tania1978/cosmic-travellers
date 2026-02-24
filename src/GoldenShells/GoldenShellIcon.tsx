import styled from "styled-components";
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

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none; /* keep clicks on the button */
  user-select: none;

  transition:
    transform 0.6s ease,
    filter 0.6s ease;

  filter: drop-shadow(0 0 6px rgba(255, 215, 120, 0.35));
`;

const ShellButton = styled.button`
  position: absolute;
  top: 16px;
  right: 60px;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
  cursor: pointer;
  pointer-events: auto;
  padding: 0;

  /* Optional: keep the button itself calm */
  transition: transform 0.6s ease;

  &:hover ${/* sc-selector */ Img} {
    transform: scale(1.06);
    filter: drop-shadow(0 0 12px rgba(255, 220, 140, 0.7))
      drop-shadow(0 0 22px rgba(255, 200, 90, 0.5));
  }
`;
