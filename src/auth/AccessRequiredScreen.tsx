import styled from "styled-components";

type AccessRequiredScreenProps = {
  videoSrc: string;
  title: string;
  message: string;
  buttonLabel: string;
  onAction: () => void;
};

export function AccessRequiredScreen({
  videoSrc,
  title,
  message,
  buttonLabel,
  onAction,
}: AccessRequiredScreenProps) {
  return (
    <Wrapper>
      <BackgroundVideo key={videoSrc} autoPlay muted loop playsInline>
        <source src={videoSrc} type="video/mp4" />
      </BackgroundVideo>

      <Overlay />

      <Content>
        <Title>{title}</Title>

        <Message>{message}</Message>

        <Button onClick={onAction}>{buttonLabel}</Button>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 50%;
  height: 50dvh;
  overflow: hidden;
  border-radius: 15px;
`;

const BackgroundVideo = styled.video`
  @media (min-width: 769px) {
    object-position: center center;
  }

  @media (max-width: 768px) {
    object-position: center bottom;
    transform: scale(1.15);
  }

  position: absolute;
  inset: 0;
  z-index: 1;

  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65),
    rgba(0, 0, 0, 0.15) 50%,
    rgba(0, 0, 0, 0.45)
  );
`;

const Content = styled.div`
  position: relative;
  z-index: 2;

  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  text-align: center;

  padding: 48px 24px 72px;
`;

const Title = styled.h1`
  color: white;
  margin: 0 0 12px;

  font-size: clamp(2rem, 5vw, 3.5rem);

  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
`;

const Message = styled.p`
  color: white;
  margin: 0 0 28px;

  max-width: 500px;

  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.5;

  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
`;

const Button = styled.button`
  border: none;
  cursor: pointer;

  padding: 14px 28px;
  border-radius: 999px;

  font-size: 1rem;
  font-weight: 700;

  color: #2c1c00;

  background: linear-gradient(180deg, #fff4b5, #ffd870, #f6b642);

  box-shadow:
    0 0 20px rgba(255, 215, 100, 0.5),
    0 8px 20px rgba(0, 0, 0, 0.3);

  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.97);
  }
`;
