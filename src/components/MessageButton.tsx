import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ModalIconButton } from "./ModalIconButton";
import { useUserState } from "../contexts/userContext";
import { useOptionalGoldenShells } from "../GoldenShells/GoldenShellsProvider";
import { useLocation } from "react-router-dom";

type MessageButtonProps = {
  iconSrc?: string;
  size?: number;
  isLoggedIn: boolean;
  childFirstName: string | null;
};

export const MessageButton = (props: MessageButtonProps) => {
  const {
    iconSrc = "/ui/message-button.png",
    size = 150,
    isLoggedIn,
    childFirstName,
  } = props;
  const location = useLocation();

  const inHomePage = location.pathname === "/";
  const goldenShells = useOptionalGoldenShells();
  const isModalOpen = goldenShells?.isModalOpen;

  const { setChildFirstName } = useUserState();

  const [firstName, setFirstName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const completionVideoRef = useRef<HTMLVideoElement | null>(null);

  const shouldShowCompletionVideo =
    !!childFirstName &&
    !!goldenShells?.hasEarnedAllBookletShells &&
    !!goldenShells?.shellCompletionVideoSrc;

  // 🎬 Normal video playback
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.currentTime = 0;
    v.volume = 0.5;

    if (!childFirstName && !shouldShowCompletionVideo) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [childFirstName, shouldShowCompletionVideo]);

  // 🎬 Completion video playback
  useEffect(() => {
    const v = completionVideoRef.current;
    if (!v) return;

    if (shouldShowCompletionVideo) {
      v.currentTime = 0;
      v.volume = 0.6;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [shouldShowCompletionVideo]);

  const handleSubmit = async () => {
    if (!firstName.trim()) return;

    setIsSaving(true);
    try {
      await setChildFirstName(firstName);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoggedIn || isModalOpen) return null;
  const showGreeting = inHomePage && !!childFirstName;
  const showIntroButton = inHomePage && !childFirstName;
  const showCompletionButton =
    !inHomePage && !!childFirstName && shouldShowCompletionVideo;

  return (
    <>
      {showGreeting && <Greeting>{`Hi ${childFirstName}!`}</Greeting>}

      {showIntroButton && (
        <ModalIconButton
          iconSrc={iconSrc}
          ariaLabel="message-button"
          size={size}
        >
          {() => (
            <>
              <Video
                ref={videoRef}
                src={`${import.meta.env.BASE_URL}ui/sebba-msg.mp4`}
                playsInline
                preload="auto"
                onLoadedData={(e) => {
                  const v = e.currentTarget;
                  v.currentTime = 0;
                  v.volume = 0.5;
                  v.play().catch(() => {});
                }}
              />

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
            </>
          )}
        </ModalIconButton>
      )}

      {showCompletionButton && (
        <ModalIconButton
          iconSrc={iconSrc}
          ariaLabel="message-button"
          size={size}
        >
          {({ close }) => (
            <VideoShell>
              <CompletionVideo
                ref={completionVideoRef}
                src={goldenShells?.shellCompletionVideoSrc}
                playsInline
                preload="auto"
                controls={false}
                onLoadedData={(e) => {
                  const v = e.currentTarget;
                  v.currentTime = 0;
                  v.volume = 0.6;
                  v.play().catch(() => {});
                }}
                onEnded={close}
              />
            </VideoShell>
          )}
        </ModalIconButton>
      )}
    </>
  );
};
const Greeting = styled.p`
  margin: 0;
  padding: 6px 12px;
  font-family: Fredoka, sans-serif;
  font-size: 20px;
  letter-spacing: 2px;
  color: white;
  white-space: nowrap;
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
`;

const SubmitButton = styled.button`
  background-image: url("/ui/name-button.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  width: 280px;
  height: 70px;

  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #b8b8c9;
  font-size: 14px;
  letter-spacing: 1px;
  font-weight: 600;
`;
