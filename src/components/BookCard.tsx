import styled from "styled-components";
import type { Book } from "../data/books/books";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/authContext";

interface IBookCardProps {
  b: Book;
  flipped: boolean;
  toggleFlip: (slug: string) => void;
}

export default function BookCard({ b, flipped, toggleFlip }: IBookCardProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { language } = i18n;
  const { isLoggedIn, setAuthModalOpen } = useAuth();

  const titleText = t(b.title);
  const subtitleText = b.subtitle ? t(b.subtitle) : "";
  const summaryText = b.summary ? t(b.summary) : t("ui.summaryComingSoon");

  const handleOpenBook = () => {
    if (!b.isLocked) {
      navigate(`/${b.slug}/1`);
    }
  };

  return (
    <FlipCard $flipped={flipped}>
      <div className="flipper">
        {/* FRONT */}
        <div className="face front" style={{ textAlign: "center" }}>
          <Card $locked={b.isLocked}>
            {!b.isLocked && (
              <CardTapArea
                type="button"
                aria-label={`Open ${titleText}`}
                onClick={handleOpenBook}
              />
            )}

            <Thumb>
              <ThumbImg
                src={b.thumbnailSrc}
                alt={titleText}
                $locked={b.isLocked}
              />
            </Thumb>

            <CardMeta $locked={b.isLocked}>
              <BookTitle>{titleText}</BookTitle>
              {b.subtitle && <BookSubTitle>{subtitleText}</BookSubTitle>}
            </CardMeta>

            <CenterWrapper>
              <SummaryLink
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFlip(b.slug);
                }}
              >
                <img
                  src={
                    language === "el" ? "/ui/summary-el.png" : "/ui/summary.png"
                  }
                  alt="Read story summary"
                />
              </SummaryLink>
            </CenterWrapper>

            {b.isLocked && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <BuyBtn
                  type="button"
                  onClick={() => {
                    isLoggedIn
                      ? alert("Payment Flow to be added")
                      : setAuthModalOpen(true);
                  }}
                >
                  <img src="/ui/buybutton-3.png" alt="" aria-hidden="true" />
                  <span>{t("bookshelf.unlock")}</span>
                </BuyBtn>
              </div>
            )}
          </Card>
        </div>

        {/* BACK */}
        <div className="face back" style={{ textAlign: "center" }}>
          <Card $locked={b.isLocked}>
            <BackMeta>
              <SummaryTitle>{titleText}</SummaryTitle>
              <BackText>{summaryText}</BackText>

              <BackRow>
                <BackBtn
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFlip(b.slug);
                  }}
                >
                  <img src="/ui/back-arrow.png" alt="Back" />
                </BackBtn>
              </BackRow>
            </BackMeta>
          </Card>
        </div>
      </div>
    </FlipCard>
  );
}

const Card = styled.div<{ $locked?: boolean }>`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);

  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  height: 440px;
  width: 270px;
  margin: auto;

  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(120, 180, 255, 0.15);

  animation: fadeIn 180ms ease;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CardTapArea = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 270px;
  z-index: 2;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
`;

const Thumb = styled.div`
  aspect-ratio: 1/1;
  background: #000;
`;

const ThumbImg = styled.img<{ $locked?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  filter: ${({ $locked }) =>
    $locked ? "grayscale(100%) brightness(1.1) contrast(0.6)" : "none"};

  opacity: ${({ $locked }) => ($locked ? 0.6 : 1)};

  transition:
    filter 0.3s ease,
    opacity 0.3s ease;
`;

const CardMeta = styled.div<{ $locked?: boolean }>`
  padding: 10px 10px 0px 10px;
  opacity: ${({ $locked }) => ($locked ? 0.7 : 1)};
`;

const BookTitle = styled.p`
  font-size: 1.25rem;
  margin: 6px 0 0 0;
  text-align: center;
`;

const BookSubTitle = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.7;
  text-align: center;
`;

const SummaryLink = styled.button`
  position: relative;
  z-index: 3;
  margin-top: 8px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  align-self: center;

  font-size: 0;
  line-height: 0;

  img {
    height: 28px;
    width: auto;
    display: block;
  }
`;

const BuyBtn = styled.button`
  z-index: 3;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  margin: 10px auto 6px auto;
  display: block;
  position: absolute;
  top: 100px;

  img {
    width: 135px;
    height: auto;
    display: block;
  }

  span {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;

    font-size: 0.75rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.inkBlue};
    text-shadow:
      0 0 4px rgba(255, 255, 255, 0.9),
      0 0 10px rgba(120, 180, 255, 0.6);

    pointer-events: none;
  }

  transition:
    transform 0.25s ease,
    filter 0.25s ease;

  &:hover {
    transform: scale(1.04);
    filter: brightness(1.08);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const FlipCard = styled.div<{ $flipped: boolean }>`
  perspective: 1000px;
  -webkit-perspective: 1000px;
  position: relative;
  width: 100%;
  height: 100%;
  isolation: isolate;

  .flipper {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    transition: transform 700ms ease;
    transform: ${({ $flipped }) =>
      $flipped ? "rotateY(180deg)" : "rotateY(0deg)"};
    will-change: transform;
  }

  .face {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
  }

  .front {
    transform: rotateY(0deg) translateZ(1px);
    -webkit-transform: rotateY(0deg) translateZ(1px);
    pointer-events: ${({ $flipped }) => ($flipped ? "none" : "auto")};
    z-index: ${({ $flipped }) => ($flipped ? 1 : 2)};
  }

  .back {
    transform: rotateY(180deg) translateZ(1px);
    -webkit-transform: rotateY(180deg) translateZ(1px);
    pointer-events: ${({ $flipped }) => ($flipped ? "auto" : "none")};
    z-index: ${({ $flipped }) => ($flipped ? 2 : 1)};
  }

  @media (prefers-reduced-motion: reduce) {
    .flipper {
      transition: none;
      transform: none;
    }

    .face {
      position: static;
      transform: none;
      height: auto;
    }

    .back {
      display: ${({ $flipped }) => ($flipped ? "block" : "none")};
      pointer-events: auto;
    }

    .front {
      display: ${({ $flipped }) => ($flipped ? "none" : "block")};
      pointer-events: auto;
    }
  }
`;

const BackMeta = styled.div`
  padding: 10px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;

const SummaryTitle = styled.h3`
  position: relative;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin: 8px 0 0 0;

  color: ${({ theme }) => theme.colors.inkBlue};

  text-shadow:
    0 0 4px rgba(120, 180, 255, 0.6),
    0 0 10px rgba(120, 180, 255, 0.35);

  animation: titleGlow 5s ease-in-out infinite alternate;

  @keyframes titleGlow {
    0% {
      text-shadow:
        0 0 3px rgba(120, 180, 255, 0.5),
        0 0 8px rgba(120, 180, 255, 0.25);
    }
    100% {
      text-shadow:
        0 0 6px rgba(150, 200, 255, 0.8),
        0 0 14px rgba(150, 200, 255, 0.45);
    }
  }

  &::before,
  &::after {
    content: "✦";
    position: absolute;
    font-size: 0.75rem;
    color: #ffffff;
    opacity: 0.8;
    animation: sparkleFloat 4s ease-in-out infinite;
  }

  &::before {
    left: -14px;
    top: 2px;
    animation-delay: 0s;
  }

  &::after {
    right: -14px;
    top: 6px;
    animation-delay: 2s;
  }

  @keyframes sparkleFloat {
    0% {
      transform: translateY(0px) scale(0.9);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-6px) scale(1.1);
      opacity: 1;
    }
    100% {
      transform: translateY(0px) scale(0.9);
      opacity: 0.3;
    }
  }
`;

const BackText = styled.div`
  font-size: 0.875rem;
  line-height: 1.4;
  opacity: 0.85;
  min-height: 320px;
  flex: 1;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.inkBlue};
  text-align: left;

  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;

const BackRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-right: 10px;
  position: relative;
  bottom: 30px;
`;

const BackBtn = styled.button`
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  font-size: 0;
  line-height: 0;

  img {
    height: 28px;
    width: auto;
    display: block;
  }
`;

export const CenterWrapper = styled.div<{ book?: number }>`
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
`;
