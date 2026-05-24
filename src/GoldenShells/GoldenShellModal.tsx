import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useGoldenShells } from "./GoldenShellsProvider";
import { Img } from "./GoldenShellIcon";
import { useTranslation } from "react-i18next";

const FADE_MS = 1000;
const CLOSE_MS = 2000;

export function GoldenShellModal() {
  const { activeOpportunity, isModalOpen, closeModal, submitAnswer } =
    useGoldenShells();

  const [feedback, setFeedback] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const { t } = useTranslation();
  const opp = activeOpportunity;

  const visible = isModalOpen;
  if (!visible) return null;

  const handleClose = () => {
    setFeedback(null);
    if (isClosing) return;

    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
    }, CLOSE_MS);
    closeModal();
  };

  const onPick = async (choiceId: string) => {
    console.log("onPick");
    const res = await submitAnswer(choiceId);

    if (res.correct) {
      window.setTimeout(() => {
        setFeedback(null);
        closeModal();
      }, 650);

      return;
    }

    setFeedback("Try again.");
    window.setTimeout(() => setFeedback(null), 900);
  };

  return (
    <Overlay
      $closing={isClosing}
      id="overlay"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <CardWrap onClick={(e) => e.stopPropagation()}>
        <Medallion aria-hidden="true">
          <Img src="/ui/golden-shell.png" alt="" draggable={false} />
        </Medallion>

        <LuminousFrame id="LuminousFrame">
          <Dust id="Dust" />
          <VideoBg
            src="/ui/magic-library.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <GlassPanel id="GlassPanel">
            <Header>
              <Title>{t("ui.modalTitle")}</Title>
              <CloseButton onClick={handleClose} aria-label="Close">
                ✕
              </CloseButton>
            </Header>

            {opp && (
              <>
                <QuestionText>{opp.question}</QuestionText>

                <ChoicesGrid>
                  {opp.choices.map((c) => (
                    <ChoiceRow key={c.id} onClick={() => onPick(c.id)}>
                      <ChoiceLabel>{c.label}</ChoiceLabel>
                      {/* <ChoiceArrow aria-hidden="true">›</ChoiceArrow> */}
                    </ChoiceRow>
                  ))}
                </ChoicesGrid>

                {feedback && <FeedbackText>{feedback}</FeedbackText>}
              </>
            )}
          </GlassPanel>
        </LuminousFrame>
      </CardWrap>
    </Overlay>
  );
}

const CardWrap = styled.div`
  width: min(720px, calc(100vw - 48px));

  position: relative;
  padding-top: 70px;
  margin-top: 50px;

  @media (max-width: 768px) {
    width: calc(100vw - 20px);
    padding-top: 52px;
    margin-top: 0;
  }
`;

const LuminousFrame = styled.div`
  position: relative;
  border-radius: 30px;
  padding: 14px;
  min-height: 420px;

  background: linear-gradient(
    180deg,
    rgba(255, 215, 140, 0.85),
    rgba(255, 170, 90, 0.55)
  );

  box-shadow:
    0 0 40px rgba(255, 190, 110, 0.45),
    0 0 90px rgba(255, 170, 80, 0.25),
    0 25px 80px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    min-height: auto;
    border-radius: 22px;
    padding: 10px;
  }
`;

const GlassPanel = styled.div`
  border-radius: 20px;
  padding: 24px 24px 20px;
  background: transparent;
  width: 90%;
  backdrop-filter: blur(1.5px);
  margin: 10px auto;

  box-shadow:
    inset 0 0 60px rgba(120, 160, 255, 0.08),
    inset 0 0 0 1px rgba(255, 220, 170, 0.12),
    0 20px 60px rgba(0, 0, 0, 0.35);

  color: rgba(255, 245, 225, 0.95);

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    padding: 18px 16px 16px;
    box-sizing: border-box;
  }
`;

const QuestionText = styled.div`
  margin-top: 14px;
  font-size: 20px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.92);

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ChoiceLabel = styled.div`
  font-family: "Cause", sans-serif !important;
  padding-left: 6px;
  font-size: 20px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.92);

  @media (max-width: 768px) {
    font-size: 16px;
    padding-left: 0;
  }
`;

const ChoiceRow = styled.button`
  width: 100%;
  font-family: "Cause", sans-serif !important;
  border: none;
  cursor: pointer;
  text-align: center;
  pointer-events: auto;

  padding: 14px 14px;
  border-radius: 999px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );

  @media (max-width: 768px) {
    padding: 12px;
    min-height: 54px;
  }
`;

const Medallion = styled.div`
  position: absolute;
  top: 0;
  left: 45%;
  transform: translateX(-45%);
  z-index: 5;

  width: 70px;
  height: 70px;

  @media (max-width: 768px) {
    width: 54px;
    height: 54px;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const breathe = keyframes`
  0%, 100% { transform: translateY(0); filter: drop-shadow(0 0 10px rgba(255,190,120,.25)); }
  50% { transform: translateY(-1px); filter: drop-shadow(0 0 16px rgba(255,190,120,.35)); }
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
  outline: 5px solid red;

  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);

  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} ${FADE_MS}ms
    ease forwards;
`;

const VideoBg = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;

  width: 95%;
  height: 93%;

  transform: translate(-50%, -50%);

  object-fit: cover;
  border-radius: 22px;

  z-index: 0;
`;

/* Top row: title + close */
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
`;

const Title = styled.div`
  font-weight: 650;
  letter-spacing: 0.2px;
  font-size: 20px;
  color: rgba(255, 235, 215, 0.92);
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.78);
  font-size: 18px;
  line-height: 1;
  padding: 6px 8px;
  border-radius: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.92);
  }
`;

const ChoicesGrid = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 10px;
`;

const FeedbackText = styled.div`
  margin-top: 12px;
  font-size: 14px;
  color: rgba(255, 235, 215, 0.78);
  min-height: 20px;
`;

/* Optional: subtle dust in the corners (no asset needed) */
const Dust = styled.div`
  pointer-events: none;
  position: absolute;
  inset: -40px -40px -50px -40px;
  border-radius: 38px;
  opacity: 0.22;

  background:
    radial-gradient(
      600px 220px at 15% 85%,
      rgba(255, 180, 110, 0.2),
      transparent 60%
    ),
    radial-gradient(
      520px 200px at 85% 85%,
      rgba(255, 180, 110, 0.18),
      transparent 62%
    ),
    radial-gradient(
      420px 180px at 50% 0%,
      rgba(255, 180, 110, 0.12),
      transparent 65%
    );
`;
