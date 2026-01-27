import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BOOKS } from "../data/books/books";
import React from "react";
import PageBackground from "../components/PageBackground";
import { ArrowButton } from "../components/ArrowButton";

/* ---------- Background ---------- */

/* ---------- Layout ---------- */

const Page = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  color: #0b1220;
`;

const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
`;

const TitleWrap = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;

  /* Soft magical glow */
  text-shadow:
    0 0 4px rgba(255, 255, 255, 0.8),
    0 0 12px rgba(173, 216, 255, 0.6),
    0 0 22px rgba(120, 180, 255, 0.35);

  /* Subtle shimmer animation */
  animation: titleGlow 6s ease-in-out infinite alternate;

  @keyframes titleGlow {
    0% {
      text-shadow:
        0 0 4px rgba(255, 255, 255, 0.7),
        0 0 10px rgba(173, 216, 255, 0.5),
        0 0 18px rgba(120, 180, 255, 0.3);
    }
    100% {
      text-shadow:
        0 0 6px rgba(255, 255, 255, 1),
        0 0 16px rgba(173, 216, 255, 0.8),
        0 0 28px rgba(120, 180, 255, 0.5);
    }
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Select = styled.select`
  appearance: none;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);
  color: #0b1220;
  font-size: 14px;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: rgba(0, 0, 0, 0.22);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
`;

const CardButton = styled.button<{ $locked?: boolean }>`
  padding: 0;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  cursor: ${({ $locked }) => ($locked ? "not-allowed" : "pointer")};
  opacity: ${({ $locked }) => ($locked ? 0.5 : 1)};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
`;

const Thumb = styled.div`
  aspect-ratio: 1/1;
  background: #000;
`;

const BuyButton = styled.button`
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #ffd76a, #ffb347);
  color: #3a2b00;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
  }
`;

const ThumbImg = styled.img<{ $locked?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  filter: ${({ $locked }) =>
    $locked ? "grayscale(100%) brightness(1.1)" : "none"};
  opacity: ${({ $locked }) => ($locked ? 0.7 : 1)};
  transition:
    filter 0.3s ease,
    opacity 0.3s ease;
`;

const BookTitle = styled.p`
  font-size: 20px;
  margin: 6px 0 0 0;
`;

const BookSubTitle = styled.p`
  font-size: 16px;
  margin: 0;
  opacity: 0.7;
`;

const CardMeta = styled.div`
  padding: 10px 6px 2px 6px;
`;

/* ---------- Footer Credit ---------- */

const Credit = styled.div`
  position: fixed;
  right: 16px;
  bottom: 14px;
  font-size: 12px;
  opacity: 0.65;
  color: rgba(11, 18, 32, 0.8);
  pointer-events: none;
`;
const UnlockWrap = styled.div`
  position: relative;
  width: 120px;
  cursor: pointer;

  transition:
    transform 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.18));
  }

  &:active {
    transform: translateY(0px);
  }
`;

const UnlockImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const UnlockText = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;
  font-size: 12px;
  color: #062038ff;
  text-align: center;
  padding: 0 16px;
  pointer-events: none; /* allows clicks to pass through */
`;

const Price = styled.div`
  margin-top: 6px;
  font-size: 14px;
  color: #3a2b00;
  opacity: 0.8;
  text-align: center;
`;

/* ---------- Component ---------- */

export function Bookshelf() {
  const navigate = useNavigate();

  // Simple local state for now (we’ll wire i18n later)
  const [language, setLanguage] = React.useState<"en" | "el" | "de">("en");

  return (
    <>
      <PageBackground src="/ui/bg5.jpg" overlay />
      <Page>
        <TitleWrap>
          <Title>The Cosmic Travellers and the Secrets of Life</Title>
        </TitleWrap>
        <TopBar>
          <TitleWrap></TitleWrap>
          <Controls>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="el">Ελληνικά</option>
              <option value="de">Deutsch</option>
            </Select>
          </Controls>
        </TopBar>

        <Grid>
          {BOOKS.map((b) => (
            <div key={b.slug}>
              <CardButton
                onClick={() => navigate(`/${b.slug}/1`)}
                disabled={b.isLocked}
                $locked={b.isLocked}
                aria-label={`Open ${b.title}`}
              >
                <Thumb>
                  <ThumbImg src={b.thumbnailSrc} alt={b.title} />
                </Thumb>
                <CardMeta>
                  <BookTitle>{b.title}</BookTitle>
                  <BookSubTitle>{b.subtitle}</BookSubTitle>
                </CardMeta>
              </CardButton>
              {b.isLocked && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "12px",
                  }}
                >
                  <UnlockWrap onClick={() => alert("Purchase flow later")}>
                    <UnlockImg src="/ui/buybutton1.png" alt="" />
                    <UnlockText>Unlock This Adventure</UnlockText>
                  </UnlockWrap>
                  <Price>€4.99</Price>
                </div>
              )}
            </div>
          ))}
        </Grid>
      </Page>

      <Credit>© {new Date().getFullYear()} Your Name</Credit>
    </>
  );
}
