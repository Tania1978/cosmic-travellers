import { useEffect, useRef, useState, type ReactNode } from "react";
import styled, { css, keyframes } from "styled-components";
import { CustomIconButton } from "./CustomIconButton";

type ModalIconButtonProps = {
  iconSrc: string;
  ariaLabel: string;
  size?: number;
  children: (helpers: { close: () => void; isClosing: boolean }) => ReactNode;
  disabled?: boolean;
};

const FADE_MS = 1000;
const CLOSE_MS = 2000;

export function ModalIconButton({
  iconSrc,
  ariaLabel,
  size = 120,
  children,
  disabled = false,
}: ModalIconButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const open = () => {
    setHasBeenOpened(true);
    setIsVisible(true);
  };

  const close = () => {
    if (isClosing) return;

    setIsClosing(true);

    window.setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, CLOSE_MS);
  };

  useEffect(() => {
    if (!isVisible || isClosing) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (target && modalRef.current && !modalRef.current.contains(target)) {
        close();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isVisible, isClosing]);

  if (disabled) return null;

  return (
    <>
      <PulseWrapper $shouldPulse={!hasBeenOpened}>
        <CustomIconButton
          src={iconSrc}
          onClick={open}
          ariaLabel={ariaLabel}
          size={size}
        />
      </PulseWrapper>

      {isVisible && (
        <Overlay $closing={isClosing}>
          <Modal ref={modalRef} $closing={isClosing}>
            {children({ close, isClosing })}
          </Modal>
        </Overlay>
      )}
    </>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const pulseGlow = keyframes`
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0.4));
  }

  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
  }

  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0.4));
  }
`;

const Overlay = styled.div<{ $closing: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  z-index: 5000;
  display: grid;
  place-items: center;

  background: rgba(15, 15, 16, 0.55);

  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} ${FADE_MS}ms
    ease forwards;
`;

const Modal = styled.div<{ $closing: boolean }>`
  width: min(90vw, 720px);
  min-height: 400px;
  padding: 40px;
  border-radius: 28px;
  overflow: hidden;
  place-items: center;
  background: rgba(34, 49, 81, 0.55);
  backdrop-filter: blur(500px);
  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} ${FADE_MS}ms
    ease forwards;
`;

const PulseWrapper = styled.div<{ $shouldPulse: boolean }>`
  display: inline-block;

  ${({ $shouldPulse }) =>
    $shouldPulse &&
    css`
      animation: ${pulseGlow} 2.8s ease-in-out infinite;
    `}

  &:hover {
    animation: none;
  }
`;
