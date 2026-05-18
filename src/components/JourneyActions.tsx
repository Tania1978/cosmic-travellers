import styled from "styled-components";
import { DesktopOnly } from "./Header";

type JourneyActionsProps = {
  children: React.ReactNode;
};

export function JourneyActions({ children }: JourneyActionsProps) {
  return (
    <DesktopOnly>
      <Wrapper>
        <Glow />

        <Inner>
          <ButtonsRow>{children}</ButtonsRow>
        </Inner>
      </Wrapper>
    </DesktopOnly>
  );
}

const Wrapper = styled.section`
  position: relative;
  z-index: 2;
  justify-content: center;

  width: min(1100px, calc(100% - 32px));
  margin: 100px auto 18px;
  padding: 14px 18px;
  border-radius: 30px;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.24) 0%,
    rgba(255, 255, 255, 0.14) 100%
  );

  border: 1px solid rgba(255, 255, 255, 0.42);

  box-shadow:
    0 18px 60px rgba(36, 96, 146, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.42);

  overflow: visible;

  @media (max-width: 700px) {
    margin-top: 96px;
    padding: 18px;
    border-radius: 28px;
  }
`;

const Glow = styled.div`
  position: absolute;

  top: -120px;
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

// const Title = styled.h2`
//   margin: 0 0 10px;
//   text-align: center;
//   font-size: 0.8rem;
//   font-weight: 900;
//   letter-spacing: 0.18em;
//   text-transform: uppercase;

//   color: rgba(255, 255, 255, 0.82);

//   text-shadow: 0 2px 10px rgba(43, 91, 139, 0.28);
// `;

const ButtonsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 18px;
  max-height: 80px;

  @media (max-width: 700px) {
    gap: 14px;
  }
`;
