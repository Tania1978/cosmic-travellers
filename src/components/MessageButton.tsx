import { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { CustomIconButton } from "./CustomIconButton";
import { useUserState } from "../contexts/userContext";
import { useTranslation } from "react-i18next";


type MessageButtonProps = {
  iconSrc?: string;
  size?: number;
  isLoggedIn: boolean;
  childFirstName: string | null;
};

const FADE_MS = 1000;
const CLOSE_MS = 2000;

export const MessageButton = ({
  iconSrc = "ui/message-button.png",
  size = 120,
  isLoggedIn,
  childFirstName,
}: MessageButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const { setChildFirstName } = useUserState();
  const { t } = useTranslation();

  const handleSubmit = async () => {
    if (!firstName.trim()) return;
    setIsSaving(true);
    try {
      await setChildFirstName(firstName);
    } finally {
      setIsSaving(false);
    }
  };

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
    if (!childFirstName || !isVisible) return;

    const timeoutId = window.setTimeout(() => {
      close();
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [childFirstName, isVisible]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isVisible && !isClosing) {
      v.currentTime = 0;
      v.volume = 0.5;
      if (!childFirstName) {
        v.play().catch(() => {});
      }
    } else {
      v.pause();
    }
  }, [isVisible, isClosing, childFirstName]);

  useEffect(() => {
    if (!isVisible || isClosing) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (modalRef.current && !modalRef.current.contains(target)) {
        close();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isVisible, isClosing]);

  return (
    <>
      {isLoggedIn && (
        <>
          <PulseWrapper $shouldPulse={!hasBeenOpened}>
            <CustomIconButton
              src={iconSrc}
              onClick={open}
              ariaLabel="message-button"
              size={size}
            />
          </PulseWrapper>

          {isVisible && (
            <Overlay $closing={isClosing} id="overlay">
              <Modal ref={modalRef} $closing={isClosing} id="modal">
                <Video
                  ref={videoRef}
                  src={`${import.meta.env.BASE_URL}ui/sebba-msg.mp4`}
                  playsInline
                  preload="auto"
                />

                {!childFirstName && (
                  <FormSection>
                    <NameInput
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your first name"
                      maxLength={20}
                    />

                    <SubmitButton
                      disabled={!firstName.trim() || isSaving}
                      onClick={handleSubmit}
                    >
                      {isSaving ? "Saving..." : "Begin Adventure"}
                    </SubmitButton>
                  </FormSection>
                )}

                {childFirstName && (
                  <p
                    style={{
                      marginTop: "20px",
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#431d84ff",
                    }}
                  >
                    {t("ui.welcomeAdventure", { name: childFirstName })}
                  </p>
                )}
              </Modal>
            </Overlay>
          )}
        </>
      )}
    </>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const Overlay = styled.div<{ $closing: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 5000;
  display: grid;
  place-items: center;
  background: rgba(180, 175, 175, 0.55);
  backdrop-filter: blur(100px);
  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} ${FADE_MS}ms
    ease forwards;
`;

const Modal = styled.div<{ $closing: boolean }>`
  width: min(500px, calc(100vw - 50px));
  height: 550px;
  padding: 20px;
  border-radius: 22px;
  overflow: hidden;
  background: rgba(202, 202, 217, 0.9);
  box-shadow:
    0 30px 90px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} ${FADE_MS}ms
    ease forwards;
`;

const Video = styled.video`
  width: 100%;
  height: min(70vh, 385px);
  display: block;
  object-fit: cover;
  background: black;
  border-radius: 8px;
`;

const FormSection = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const NameInput = styled.input`
  width: 100%;
  max-width: 320px;
  padding: 14px 18px;
  font-size: 18px;
  border-radius: 18px;
  border: none;
  outline: none;
  background: white;
  text-align: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);

  &::placeholder {
    color: #b8b8c9; /* lighter color */
    transition: opacity 0.2s ease;
  }

  &:focus::placeholder {
    opacity: 0; /* hide placeholder when focused */
  }
`;

const SubmitButton = styled.button`
  background: transparent;
  border: none;

  background-image: url("/ui/name-button.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  width: 280px;
  height: 70px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #b8b8c9;
  font-size: 14px;
  letter-spacing: 1px;
  font-weight: 600;
  cursor: pointer;

  transition:
    transform 0.25s ease,
    filter 0.25s ease,
    opacity 0.25s ease;

  &:hover {
    transform: scale(1.08);
    opacity: 1;
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.6));
  }

  &:active {
    transform: scale(0.95);
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
