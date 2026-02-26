import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useGoldenShells } from "./GoldenShellsProvider";

export function ShellSatchel() {
  const { totalEarned, lastEvent, clearLastEvent, setSatchelEl } =
    useGoldenShells();

  const [pulse, setPulse] = useState(false);
  const [visible, setVisible] = useState(false);
  const satchelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible) {
      setSatchelEl(satchelRef.current);
    }
  }, [visible, setSatchelEl]);

  useEffect(() => {
    if (lastEvent?.type === "shellEarned") {
      setVisible(true);
      setPulse(true);

      const pulseTimer = window.setTimeout(() => {
        setPulse(false);
      }, 900);

      const hideTimer = window.setTimeout(() => {
        setVisible(false); // 👈 fully remove from DOM
        clearLastEvent();
      }, 2200); // calm cinematic timing

      return () => {
        window.clearTimeout(pulseTimer);
        window.clearTimeout(hideTimer);
      };
    }
  }, [lastEvent, clearLastEvent]);

  // 👇 THIS is the key change — removes EVERYTHING (icon, container, count)
  if (!visible) return null;

  return (
    <SatchelContainer ref={satchelRef} $pulse={pulse}>
      <SatchelIcon src={"/ui/saschet.png"} alt="" draggable={false} />
      <Count>{totalEarned}</Count>
    </SatchelContainer>
  );
}

const SatchelContainer = styled.div<{ $pulse: boolean }>`
  position: absolute;
  left: 16px;
  top: 10px;
  margin-bottom: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 12px;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);

  pointer-events: none;
  color: white;

  transform: ${({ $pulse }) => ($pulse ? "scale(1.08)" : "scale(1)")};
  transition:
    transform 300ms ease,
    box-shadow 300ms ease;

  box-shadow: ${({ $pulse }) =>
    $pulse ? "0 0 12px 4px rgba(255, 215, 120, 0.45)" : "none"};
`;

const SatchelIcon = styled.img`
  width: 35px;
  height: 35px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
`;

const Count = styled.span`
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  pointer-events: none;
`;
