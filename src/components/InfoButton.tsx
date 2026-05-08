import { useState } from "react";
import styled from "styled-components";
import { ModalIconButton } from "./ModalIconButton";

import { useParams } from "react-router-dom";
import { BOOKS } from "../data/books/books";

export function InfoButton() {
  const { bookSlug } = useParams();
  const foundBook = BOOKS.find((b) => b.slug === bookSlug);


  const items = foundBook?.infoItems ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const item = items[currentIndex];

  return (
    <ModalIconButton
      iconSrc="/ui/info-button.png"
      ariaLabel="important-information"
      size={150}
    >
      {({ close }) => {
        const handleClose = () => {
          setCurrentIndex((prev) => (prev + 1) % items.length);
          close();
        };

        return (
          <>
            <CloseButton onClick={handleClose}>✕</CloseButton>

            <Title>
              {item.type === "experiment"
                ? "🧪 Try this at home"
                : "✨ Did you know?"}
            </Title>

            {item.src && <Video src={item.src} autoPlay playsInline />}

            <ItemTitle>{item.title}</ItemTitle>

            <Text>{item.text}</Text>
          </>
        );
      }}
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

const Video = styled.video`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 12px;
`;

const ItemTitle = styled.h3`
  margin: 0;
  color: white;
  font-family: Fredoka, sans-serif;
  font-size: 20px;
`;
