import styled from "styled-components";
import { BOOKS } from "../data/books/books";
import PageBackground from "../components/PageBackground";
import { useState } from "react";
import BookCard from "../components/BookCard";
import { useTranslation } from "react-i18next";

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

  font-size: 10px;
  color: rgba(246, 241, 237, 0.85);
  text-align: center;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px rgba(120, 180, 255, 0.4);
  @media (min-width: 700px) {
    font-size: 18px;
  }

  @media (min-width: 900px) {
    font-size: 20px;
    bottom: 20px;
  }
`;

const TitlePicture = styled.picture`
  display: block;
  width: 90%;
  margin: 0 auto;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const TitleImg = styled.img`
  width: 90%;
  height: auto;
  display: block;
  padding-left: 30px;
`;

/* ---------- Component ---------- */

export function Bookshelf() {
  const [flippedSlug, setFlippedSlug] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isMobile = window.innerWidth <= 768;

  const toggleFlip = (slug: string) => {
    setFlippedSlug((cur) => (cur === slug ? null : slug));
  };

  const getTitleImageSrc = ({
    lang,
    isMobile,
  }: {
    lang: string;
    isMobile: boolean;
  }) => {
    if (isMobile) {
      return lang == "el" ? "/ui/title-gr-1.png" : "/ui/title-1.png";
    }
    return lang == "el" ? "/ui/title-gr.png" : "/ui/title.png";
  };

  const finalSrc = getTitleImageSrc({ lang, isMobile });

  return (
    <>
      <PageBackground src="/ui/bg5.jpg" overlay />

      <Page>
        <TitleWrap>
          <TitlePicture>
            {/* <source media="(max-width: 600px)" srcSet="ui/title-1.png" /> */}
            <TitleImg src={finalSrc} alt="title" />
          </TitlePicture>
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
