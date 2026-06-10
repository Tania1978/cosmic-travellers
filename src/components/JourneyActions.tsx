import styled from "styled-components";
import { DesktopOnly } from "./Header";

type JourneyActionsProps = {
  children: React.ReactNode;
};

export function JourneyActions({ children }: JourneyActionsProps) {
  const shouldShowJourneyActions = true;
  return (
    <DesktopOnly>
      {shouldShowJourneyActions && (
        <Wrapper>
          <Glow />

          <Inner>
            <ButtonsRow>{children}</ButtonsRow>
          </Inner>
        </Wrapper>
      )}
    </DesktopOnly>
  );
}

const Wrapper = styled.section`
  position: relative;
  top: 100px;
  justify-content: center;
  margin: 20px auto 0;

  display: flex;
  align-items: center;
  gap: 1rem;

  width: 80%;
  max-width: calc(100% - 48px);
  box-sizing: border-box;

  padding: 10px 28px;
  border-radius: 999px;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22),
    rgba(255, 255, 255, 0.08)
  );

  border: 1px solid rgba(255, 255, 255, 0.35);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    0 18px 50px rgba(20, 40, 80, 0.25),
    0 0 35px rgba(180, 220, 255, 0.18);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  overflow: visible;
`;
const Glow = styled.div`
  position: absolute;

  top: -40px;
  left: 50%;

  transform: translateX(-50%);

  width: 420px;
  height: 240px;

  background: radial-gradient(
    circle,
    rgba(255, 240, 170, 0.22) 0%,
    rgba(255, 255, 255, 0) 72%
  );

  pointer-events: none;
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
`;

const ButtonsRow = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 18px;
  max-height: 80px;

  @media (max-width: 700px) {
    gap: 14px;
  }
`;
