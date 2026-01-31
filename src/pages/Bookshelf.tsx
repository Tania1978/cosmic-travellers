import styled from "styled-components";
import { BOOKS } from "../data/books/books";
import PageBackground from "../components/PageBackground";
import { useState } from "react";
import BookCard from "../components/BookCard";

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

const Title = styled.h1`
  font-family: "Fredoka", system-ui, sans-serif;
  font-weight: 700;

  font-size: clamp(24px, 3.4vw, 44px);
  line-height: 1.12;
  letter-spacing: 0.4px;
  text-align: center;

  /* Glow texture fill */
  background-image: url("/ui/title-glow-2.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  /* ✨ OUTER DEPTH ONLY (doesn't tint letters) */
  filter: drop-shadow(0 6px 14px rgba(121, 71, 9, 0.35));
`;

const Grid = styled.div`
  margin-top: 36px;
  display: grid;
  gap: 50px;

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
  height: clamp(450px, 34vw, 420px);
  perspective: 1200px;
`;

const CreatorCredit = styled.p`
  margin-top: 8px;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px rgba(120, 180, 255, 0.4);
  font-weight: 800;
`;

/* ---------- Component ---------- */

export function Bookshelf() {
  const [flippedSlug, setFlippedSlug] = useState<string | null>(null);

  const toggleFlip = (slug: string) => {
    setFlippedSlug((cur) => (cur === slug ? null : slug));
  };

  return (
    <>
      <PageBackground src="/ui/bg5.jpg" overlay />

      <Page>
        <TitleWrap>
          <Title>The Cosmic Travellers and the Secrets of Life</Title>
          <CreatorCredit>Created by Tania Karageorgi</CreatorCredit>
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
