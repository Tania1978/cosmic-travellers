import { useState } from "react";
import styled from "styled-components";
import { useGoldenShells } from "./GoldenShellsProvider";

/**
 * Styled Components
 * Calm, magical, child-friendly (Cosmic Travellers tone)
 */

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  z-index: 1000;
`;

const ModalCard = styled.div`
  width: min(550px, calc(100vw - 48px));
  border-radius: 20px;
  padding: 18px;

  /* Background image (replace with your actual path) */
  background-image: url("/ui/modal-gs-bg.jpg");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  /* Soft warm overlay for readability (Great Library vibe) */
  background-color: rgba(255, 248, 220, 0.92);
  background-blend-mode: overlay;

  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.25);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-weight: 700;
  font-size: 18px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;

  &:hover {
    opacity: 0.7;
  }
`;

const QuestionText = styled.div`
  margin-top: 10px;
  font-size: 18px;
  line-height: 1.35;
`;

const ChoicesGrid = styled.div`
  margin-top: 14px;
  display: grid;
  gap: 10px;
`;

const ChoiceButton = styled.button`
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  cursor: pointer;
  text-align: left;
  font-size: 16px;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    background: #fffdf6;
  }
`;

const FeedbackText = styled.div`
  margin-top: 12px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
  min-height: 20px; /* prevents layout shift */
`;

export function GoldenShellModal() {
  const {
    activeOpportunity,
    isModalOpen,
    closeModal,
    submitAnswer,
    isShellEarned,
  } = useGoldenShells();

  const [feedback, setFeedback] = useState<string | null>(null);

  const opp = activeOpportunity;
  const visible = isModalOpen && opp && !isShellEarned(opp.id);

  if (!visible) return null;

  const onPick = (choiceId: string) => {
    const res = submitAnswer(choiceId);

    if (res.correct) {
      setFeedback("✨ A Golden Shell appears!");

      // Gentle, calm close (fits Cosmic Travellers pacing)
      window.setTimeout(() => {
        setFeedback(null);
        closeModal();
      }, 650);
    } else {
      setFeedback("Let’s look again. What did we learn together?");
      window.setTimeout(() => setFeedback(null), 1200);
    }
  };

  return (
    <Overlay role="dialog" aria-modal="true" onClick={closeModal}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>🐚 Golden Shell Discovery</Title>
          <CloseButton onClick={closeModal} aria-label="Close">
            ✕
          </CloseButton>
        </Header>

        <QuestionText>{opp.question}</QuestionText>

        <ChoicesGrid>
          {opp.choices.map((c) => (
            <ChoiceButton key={c.id} onClick={() => onPick(c.id)}>
              {c.label}
            </ChoiceButton>
          ))}
        </ChoicesGrid>

        {feedback && <FeedbackText>{feedback}</FeedbackText>}
      </ModalCard>
    </Overlay>
  );
}
