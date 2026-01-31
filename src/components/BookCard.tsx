import styled from "styled-components";
import type { Book } from "../data/books/books";
import { useNavigate } from "react-router-dom";

interface IBookCardProps {
  b: Book;
  flipped: boolean;
  toggleFlip: (slug: string) => void;
}

export default function BookCard({ b, flipped, toggleFlip }: IBookCardProps) {
  const navigate = useNavigate();
  return (
    <FlipCard key={b.slug} $flipped={flipped}>
      <div className="flipper">
        {/* FRONT */}
        <div className="face front">
          <Card $locked={b.isLocked}>
            <OpenArea
              $locked={b.isLocked}
              onClick={() => {
                if (!b.isLocked) navigate(`/${b.slug}/1`);
              }}
              role="button"
              tabIndex={b.isLocked ? -1 : 0}
              onKeyDown={(e) => {
                if (b.isLocked) return;
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/${b.slug}/1`);
                }
              }}
              aria-label={`Open ${b.title}`}
            >
              <Thumb>
                <ThumbImg
                  src={b.thumbnailSrc}
                  alt={b.title}
                  $locked={b.isLocked}
                />
              </Thumb>
            </OpenArea>

            {/* Dimmed meta only (locked), NOT the whole card */}
            <CardMeta $locked={b.isLocked}>
              <BookTitle>{b.title}</BookTitle>
              <BookSubTitle>{b.subtitle}</BookSubTitle>
            </CardMeta>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <SummaryLink
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFlip(b.slug);
                }}
              >
                <img src="/ui/summary.png" alt="Read story summary" />
              </SummaryLink>
            </div>

            {/* Buy button OUTSIDE dimmed meta so it stays bright */}
            {b.isLocked && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <BuyBtn
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open("https://your-payment-link.com", "_blank");
                  }}
                >
                  <img src="/ui/buybutton-3.png" alt="" aria-hidden="true" />
                  <span>Unlock Story</span>
                </BuyBtn>
              </div>
            )}
          </Card>
        </div>

        {/* BACK */}
        <div className="face back">
          <Card $locked={b.isLocked}>
            <BackMeta>
              <SummaryTitle>{b.title}</SummaryTitle>

              <BackText>{b?.summary ?? "Summary coming soon."}</BackText>

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
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  height: 400px;
  width: 270px;
`;

const OpenArea = styled.div<{ $locked?: boolean }>`
  cursor: ${({ $locked }) => ($locked ? "not-allowed" : "pointer")};
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
  font-size: 20px;
  margin: 6px 0 0 0;
  text-align: center;
`;

const BookSubTitle = styled.p`
  font-size: 16px;
  margin: 0;
  opacity: 0.7;
  text-align: center;
`;

const SummaryLink = styled.button`
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
  position: relative;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  margin: 10px auto 14px auto;
  display: block;
  bottom: 200px;

  img {
    width: 130px;
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

    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;

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

/* ---------- Flip ---------- */

const FlipCard = styled.div<{ $flipped: boolean }>`
  perspective: 1000px;
  position: relative;
  width: 100%;
  height: 100%;
  isolation: isolate;

  .flipper {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
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
  }

  .front {
    transform: rotateY(0deg);
    pointer-events: ${({ $flipped }) => ($flipped ? "none" : "auto")};
  }

  .back {
    transform: rotateY(180deg);
    pointer-events: ${({ $flipped }) => ($flipped ? "auto" : "none")};
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

/* ---------- Back content ---------- */

const BackMeta = styled.div`
  padding: 10px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SummaryTitle = styled.h3`
  position: relative;
  text-align: center;
  font-size: 18px;
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
    font-size: 12px;
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
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.85;
  min-height: 320px;
  flex: 1;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.inkBlue};
`;

const BackRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-right: 10px;
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
