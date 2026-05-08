import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useGoldenShells } from "./GoldenShellsProvider";
import { Img } from "./GoldenShellIcon";
import { useTranslation } from "react-i18next";

const FADE_MS = 1000;
const CLOSE_MS = 2000;

export function GoldenShellModal() {
  const {
    activeOpportunity,
    isModalOpen,
    closeModal,
    submitAnswer,
  } = useGoldenShells();

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

  const onPick = (choiceId: string) => {
    const res = submitAnswer(choiceId);

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
const CardWrap = styled.div`
  width: min(720px, calc(100vw - 48px));

  position: relative;
  padding-top: 70px; /* space for the medallion overlap */
  margin-top: 50px;
`;

const LuminousFrame = styled.div`
  position: relative;
  border-radius: 30px;
  padding: 14px;
  min-height: 420px;

  /* STRONG radiant gold frame */
  background: linear-gradient(
    180deg,
    rgba(255, 215, 140, 0.85),
    rgba(255, 170, 90, 0.55)
  );

  box-shadow:
    0 0 40px rgba(255, 190, 110, 0.45),
    /* outer glow */ 0 0 90px rgba(255, 170, 80, 0.25),
    /* bloom aura */ 0 25px 80px rgba(0, 0, 0, 0.5);

  /* Inner luminous rail */
  &::before {
    content: "";
    position: absolute;
    inset: 6px;
    border-radius: 24px;
    border: 1px solid rgba(255, 225, 170, 0.9);
    box-shadow:
      0 0 18px rgba(255, 200, 120, 0.6),
      inset 0 0 25px rgba(255, 200, 120, 0.25);
    pointer-events: none;
  }
`;
const GlassPanel = styled.div`
  border-radius: 20px;
  padding: 24px 24px 20px;
  /* SPACE BLUE core (not grey) */
  background: transparent;
  width: 90%;
  /* subtle cosmic depth */
  backdrop-filter: blur(1.5px);
  margin: 10px auto;

  box-shadow:
    inset 0 0 60px rgba(120, 160, 255, 0.08),
    /* blue ambient */ inset 0 0 0 1px rgba(255, 220, 170, 0.12),
    0 20px 60px rgba(0, 0, 0, 0.35);

  color: rgba(255, 245, 225, 0.95);
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
const Medallion = styled.div`
  position: absolute;
  top: 0;
  left: 45%;
  transform: translateX(-45%); // 👈 fix

  z-index: 5;

  width: 70px;
  height: 70px;
  border-radius: 999px;
  display: grid;
  place-items: center;

  /* STRONG luminous gold */
  background: radial-gradient(
    circle at 50% 40%,
    rgba(255, 240, 200, 1) 0%,
    rgba(255, 200, 120, 0.9) 40%,
    rgba(255, 160, 70, 0.6) 70%
  );

  box-shadow:
    0 0 35px rgba(255, 200, 120, 0.8),
    0 0 80px rgba(255, 170, 90, 0.45),
    0 20px 70px rgba(0, 0, 0, 0.6);

  animation: ${breathe} 4s ease-in-out infinite;
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

const QuestionText = styled.div`
  margin-top: 14px;
  font-size: 20px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.92);
`;

const ChoicesGrid = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 10px;
`;

const ChoiceRow = styled.button`
  width: 100%;
  font-family: "Fredoka", sans-serif !important;
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

  /* pill line look */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );
  box-shadow:
    0 0 0 1px rgba(255, 220, 170, 0.12) inset,
    0 10px 26px rgba(0, 0, 0, 0.2);

  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    background 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.085),
      rgba(255, 255, 255, 0.04)
    );
    box-shadow:
      0 0 0 1px rgba(255, 220, 170, 0.18) inset,
      0 14px 34px rgba(0, 0, 0, 0.26);
  }

  &:active {
    transform: translateY(0px);
  }
`;

const ChoiceLabel = styled.div`
  font-family: "Fredoka", sans-serif !important;
  padding-left: 6px;
  font-size: 20px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.92);
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
