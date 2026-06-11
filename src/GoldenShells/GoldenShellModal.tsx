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

const Title = styled.div`
  font-weight: 650;
  letter-spacing: 0.2px;
  font-size: 20px;
  color: rgba(255, 235, 215, 0.92);

  @media (orientation: landscape) and (max-height: 500px) {
    font-size: 16px;
  }
`;

const QuestionText = styled.div`
  margin-top: 14px;
  font-size: 20px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.92);

  @media (max-width: 768px), (orientation: landscape) and (max-height: 500px) {
    font-size: 15px;
    margin-top: 8px;
  }
`;

const ChoicesGrid = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 10px;

  @media (orientation: landscape) and (max-height: 500px) {
    margin-top: 10px;
    gap: 6px;
  }
`;

const ChoiceRow = styled.button`
  width: 100%;
  font-family: "Cause", sans-serif !important;
  border: none;
  cursor: pointer;
  text-align: center;
  pointer-events: auto;

  padding: 14px;
  border-radius: 999px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );

  @media (orientation: landscape) and (max-height: 500px) {
    padding: 8px 12px;
    min-height: 38px;
  }

  transition:
    transform 0.2s ease,
    color 0.2s ease,
    text-shadow 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ChoiceLabel = styled.div`
  font-family: "Cause", sans-serif !important;
  font-size: 20px;
  line-height: 1.35;

  @media (orientation: landscape) and (max-height: 500px) {
    font-size: 15px;
  }
  color: #fffdf5;
  font-weight: 700;

  text-shadow:
    -1px -1px 0 rgba(0, 0, 0, 0.6),
    1px -1px 0 rgba(0, 0, 0, 0.6),
    -1px 1px 0 rgba(0, 0, 0, 0.6),
    1px 1px 0 rgba(0, 0, 0, 0.6),
    0 0 10px rgba(255, 245, 200, 0.8);
`;

const CardWrap = styled.div`
  width: min(720px, calc(100vw - 48px));
  position: relative;

  padding-top: 70px;
  margin-top: 150px;

  @media (max-width: 768px) {
    width: min(620px, calc(100vw - 24px));
    padding-top: 36px;
    margin-top: 40px;
  }

  @media (orientation: landscape) and (max-height: 500px) {
    width: min(620px, calc(100vw - 24px));
    padding-top: 36px;
    margin-top: 110px;
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

  @media (max-width: 768px), (orientation: landscape) and (max-height: 500px) {
    min-height: auto;
    border-radius: 20px;
    padding: 8px;
  }
`;

const GlassPanel = styled.div`
  position: relative;
  z-index: 2;

  border-radius: 20px;
  padding: 24px 24px 20px;
  background: transparent;
  width: 90%;
  backdrop-filter: blur(1.5px);
  margin: 10px auto;
  box-sizing: border-box;

  color: rgba(255, 245, 225, 0.95);

  @media (max-width: 768px), (orientation: landscape) and (max-height: 500px) {
    width: 100%;
    margin: 0;
    padding: 14px 16px 12px;
  }
`;

const Medallion = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;

  width: 70px;
  height: 70px;

  @media (max-width: 768px), (orientation: landscape) and (max-height: 500px) {
    width: 42px;
    height: 42px;
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

// const breathe = keyframes`
//   0%, 100% { transform: translateY(0); filter: drop-shadow(0 0 10px rgba(255,190,120,.25)); }
//   50% { transform: translateY(-1px); filter: drop-shadow(0 0 16px rgba(255,190,120,.35)); }
// `;

const Overlay = styled.div<{ $closing: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 5000;

  display: grid;
  place-items: center;

  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);

  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} ${FADE_MS}ms
    ease forwards;

  @media (orientation: landscape) and (max-height: 500px) {
    padding: 8px;
    box-sizing: border-box;
  }
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

const FeedbackText = styled.div`
  margin-top: 12px;
  font-size: 14px;
  color: rgba(255, 235, 215, 0.78);
  min-height: 20px;
`;

/* Optional: subtle dust in the corners (no asset needed) */
const Dust = styled.div`
  pointer-events: none;
  z-index: 1;
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
