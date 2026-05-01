import styled from "styled-components";
import { ModalIconButton } from "./ModalIconButton";


export function InfoButton() {
  return (
    <ModalIconButton
      iconSrc="/ui/info-button.png"
      ariaLabel="important-information"
      size={150}
    >
      {({ close }) => (
        <>
          <CloseButton onClick={close}>✕</CloseButton>
          <Title>Important Information</Title>
          <Text>
            Here you can add the important information for parents or children.
          </Text>
        </>
      )}
    </ModalIconButton>
  );
}

const CloseButton = styled.button`
  float: right;
  border: none;
  background: transparent;
  color: white;
  font-size: 22px;
  cursor: pointer;
`;

const Title = styled.h2`
  margin: 0 0 16px;
  color: white;
  font-family: Fredoka, sans-serif;
`;

const Text = styled.p`
  color: white;
  font-size: 18px;
  line-height: 1.5;
  font-family: Fredoka, sans-serif;
`;
