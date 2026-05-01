import { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { CustomIconButton } from "./CustomIconButton";
import { useUserState } from "../contexts/userContext";
import { useOptionalGoldenShells } from "../GoldenShells/GoldenShellsProvider";


type MessageButtonProps = {
  iconSrc?: string;
  size?: number;
  isLoggedIn: boolean;
  childFirstName: string | null;
};

const FADE_MS = 1000;
const CLOSE_MS = 2000;

export const MessageButton = (props: MessageButtonProps) => {
  const {
    iconSrc = "/ui/message-button.png",
    size = 150,
    isLoggedIn,
    childFirstName,
  } = props;

  const goldenShells = useOptionalGoldenShells();
  const isModalOpen = goldenShells?.isModalOpen;
  const { setChildFirstName } = useUserState();

  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const completionVideoRef = useRef<HTMLVideoElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const shouldShowCompletionVideo =
    !!childFirstName &&
    !!goldenShells?.hasEarnedAllBookletShells &&
    !!goldenShells?.shellCompletionVideoSrc;

  const close = () => {
    if (isClosing) return;

    setIsClosing(true);
    window.setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, CLOSE_MS);
  };

  useEffect(() => {
    if (!childFirstName || !isVisible || shouldShowCompletionVideo) return;

    const timeoutId = window.setTimeout(() => {
      close();
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [childFirstName, isVisible, shouldShowCompletionVideo]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isVisible && !isClosing && !shouldShowCompletionVideo) {
      v.currentTime = 0;
      v.volume = 0.5;

      if (!childFirstName) {
        v.play().catch(() => {});
      }
    } else {
      v.pause();
    }
  }, [isVisible, isClosing, childFirstName, shouldShowCompletionVideo]);

  useEffect(() => {
    const v = completionVideoRef.current;
    if (!v) return;

    if (isVisible && !isClosing && shouldShowCompletionVideo) {
      v.currentTime = 0;
      v.volume = 0.6;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isVisible, isClosing, shouldShowCompletionVideo]);

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

  if (!isLoggedIn) return null;

  const open = () => {
    setHasBeenOpened(true);
    setIsVisible(true);
  };

  const handleSubmit = async () => {
    if (!firstName.trim()) return;

    setIsSaving(true);
    try {
      await setChildFirstName(firstName);
    } finally {
      setIsSaving(false);
    }
  };

  if (isModalOpen) {
    return null;
  }

  return (
    <>
      {childFirstName && !shouldShowCompletionVideo ? (
        <p
          style={{
            margin: 0,
            padding: "6px 12px",
            textAlign: "center",
            fontFamily: "Fredoka, sans-serif !important",
            paddingLeft: "6px",
            fontSize: "20px",
            lineHeight: "1.5",
            color: "white",
            whiteSpace: "nowrap",
            position: "relative",
            letterSpacing: "2px",
            zIndex: 2,
          }}
        >
          {`Hi ${childFirstName}!`}
        </p>
      ) : (
        <PulseWrapper $shouldPulse={!hasBeenOpened}>
          <CustomIconButton
            src={iconSrc}
            onClick={open}
            ariaLabel="message-button"
            size={size}
          />
        </PulseWrapper>
      )}

      {isVisible && (
        <Overlay $closing={isClosing} id="overlay">
          <Modal ref={modalRef} $closing={isClosing} id="modal">
            {shouldShowCompletionVideo ? (
              <VideoShell>
                <CompletionVideo
                  ref={completionVideoRef}
                  src={goldenShells?.shellCompletionVideoSrc}
                  playsInline
                  preload="auto"
                  controls={false}
                  onEnded={close}
                />
              </VideoShell>
            ) : (
              <Video
                ref={videoRef}
                src={`${import.meta.env.BASE_URL}ui/sebba-msg.mp4`}
                playsInline
                preload="auto"
              />
            )}

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
          </Modal>
        </Overlay>
      )}
    </>
  );
};

const Modal = styled.div<{ $closing: boolean }>`
  width: min(90vw, 720px);
  max-height: 90vh;
  padding: 70px;
  border-radius: 28px;
  overflow: hidden;
  place-items: center;
  background: rgba(180, 175, 175, 0.55);
  backdrop-filter: blur(100px);
  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} ${FADE_MS}ms
    ease forwards;
`;

const VideoShell = styled.div`
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
`;

const CompletionVideo = styled.video`
  width: 100%;
  height: auto;
  display: block;
  transform: scale(1.03);
`;

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
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  z-index: 5000;
  display: grid;
  place-items: center;

  background: rgba(180, 175, 175, 0.55);

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
