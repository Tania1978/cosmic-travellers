import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
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

  useEffect(() => {
    if (!isVisible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

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

      {isVisible &&
        createPortal(
          <Overlay $closing={isClosing}>
            <Modal ref={modalRef} $closing={isClosing}>
              {children({ close, isClosing })}
            </Modal>
          </Overlay>,
          document.body,
        )}
    </>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
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
  inset: 0;
  z-index: 999999;

  display: grid;
  place-items: center;

  padding: 24px;
  box-sizing: border-box;

  background: rgba(10, 16, 28, 0.58);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} ${FADE_MS}ms
    ease forwards;
`;

const Modal = styled.div<{ $closing: boolean }>`
  position: relative;
  z-index: 1;

  width: min(90vw, 720px);
  max-height: min(86vh, 760px);

  padding: 20px;
  border-radius: 28px;
  box-sizing: border-box;
  overflow: hidden;

  background: rgba(34, 49, 81, 0.72);

  border: 1px solid rgba(255, 255, 255, 0.18);

  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);

  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);

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
