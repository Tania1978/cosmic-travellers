import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useGoldenShells } from "./GoldenShellsProvider";
import { pulseGlow } from "./GoldenShellIcon";

export function ShellSatchel() {
  const { earnedThisSession } = useGoldenShells();

  const [pulse, setPulse] = useState(false);
  const [visible, setVisible] = useState(false);
  const previousEarnedRef = useRef(earnedThisSession);

  useEffect(() => {
    if (earnedThisSession > previousEarnedRef.current) {
      setVisible(true);
      setPulse(true);

      const pulseTimer = window.setTimeout(() => {
        setPulse(false);
      }, 4000);

      const hideTimer = window.setTimeout(() => {
        setVisible(false);
      }, 4000);

      previousEarnedRef.current = earnedThisSession;

      return () => {
        window.clearTimeout(pulseTimer);
        window.clearTimeout(hideTimer);
      };
    }

    previousEarnedRef.current = earnedThisSession;
  }, [earnedThisSession]);

  if (!visible) return null;

  return (
    <SatchelContainer $pulse={pulse}>
      <SatchelIcon src="/ui/saschet.png" alt="" draggable={false} />
      <Count>{earnedThisSession}</Count>
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
  width: 60px;
  height: 60px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  animation: ${pulseGlow} 2.8s ease-in-out infinite;
`;

const Count = styled.span`
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  pointer-events: none;
`;
