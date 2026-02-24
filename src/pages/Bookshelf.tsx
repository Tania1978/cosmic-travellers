import styled from "styled-components";
import { BOOKS } from "../data/books/books";
import PageBackground from "../components/PageBackground";
import { useState } from "react";
import BookCard from "../components/BookCard";
import { useTranslation } from "react-i18next";
import { GlowText } from "../components/GlowText";

/* ---------- Layout ---------- */

const Page = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 70px auto;
  color: #0b1220;
`;

const TitleWrap = styled.div`
  text-align: center;
`;

const Grid = styled.div`
  margin-top: 36px;
  display: grid;
  gap: 100px;

  /* Large screens (your original behavior) */
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));

  /* ≤ 900px → 2 cards per row */
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* ≤ 650px → 1 card per row */
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const GridItem = styled.div`
  width: 100%;
  min-width: 0;
  position: relative;
  height: clamp(480px, 34vw, 420px);
  perspective: 1200px;
`;

const CreatorCredit = styled.p`
  position: relative;
  bottom: 20px;
  font-size: 18px;
  color: rgba(246, 241, 237, 0.85);
  text-align: center;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px rgba(120, 180, 255, 0.4);
  font-weight: 800;
  @media (min-width: 700px) {
    font-size: 18px;
  }

  @media (min-width: 900px) {
    font-size: 20px;
  }
`;

/* ---------- Component ---------- */

export function Bookshelf() {
  const [flippedSlug, setFlippedSlug] = useState<string | null>(null);
  const { t } = useTranslation();

  const toggleFlip = (slug: string) => {
    setFlippedSlug((cur) => (cur === slug ? null : slug));
  };

  return (
    <>
      <PageBackground src="/ui/bg5.jpg" overlay />

      <Page>
        <TitleWrap>
          <img src="ui/title.png" alt="title" style={{ width: "80%" }} />
          <CreatorCredit> {t("credits.createdBy")}</CreatorCredit>
        </TitleWrap>

        <Grid>
          {BOOKS.map((b) => {
            const flipped = flippedSlug === b.slug;

            return (
              <GridItem key={b.slug}>
                <BookCard flipped={flipped} b={b} toggleFlip={toggleFlip} />
              </GridItem>
            );
          })}
        </Grid>
      </Page>
    </>
  );
}
