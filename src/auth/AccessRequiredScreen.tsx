import styled from "styled-components";
import { OtherVideo } from "../components/VideoLoader";

type AccessRequiredScreenProps = {
  src: string;
  title: string;
  message: string;
  buttonLabel: string;
  onAction: () => void;
};

export function AccessRequiredScreen({
  src,
  title,
  message,
  buttonLabel,
  onAction,
}: AccessRequiredScreenProps) {
  return (
    <Wrapper>
      <OtherVideo src={src} />

      <Content>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <Button onClick={onAction}>{buttonLabel}</Button>
      </Content>
    </Wrapper>
  );
}

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

const Wrapper = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  text-align: center;
  padding: 48px 24px 72px;
`;
