import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { BOOKS } from "../data/books";
import { INTRO_PAGES } from "../data/introPages";
import { VideoStage } from "../components/VideoStage";

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 40px;
`;

const Header = styled.div`
  width: 100%;
  max-width: 1100px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 22px;
`;

const Subtitle = styled.div`
  margin-top: 6px;
  opacity: 0.7;
  font-size: 14px;
`;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function BookPageRoute() {
  const { bookSlug, page } = useParams();
  const navigate = useNavigate();

  const [hasStarted, setHasStarted] = useState(false);

  const book = BOOKS.find((b) => b.slug === bookSlug);

  if (!book) {
    return <Navigate to="/" replace />;
  }

  // For now, only intro pages exist (later: map by bookSlug)
  const pages = INTRO_PAGES;

  const pageNumber = clamp(Number(page) || 1, 1, pages.length);
  const pageIndex = pageNumber - 1;

  const showPrev = pageNumber > 1;
  const showNext = pageNumber < pages.length;

  const nextSrc = pageNumber < pages.length ? pages[pageIndex + 1].src : null;

  const goNext = () => {
    const nextPage = clamp(pageNumber + 1, 1, pages.length);
    navigate(`/${book.slug}/${nextPage}`);
  };

  const goPrev = () => {
    const prevPage = clamp(pageNumber - 1, 1, pages.length);
    navigate(`/${book.slug}/${prevPage}`);
  };

  const handleEnded = () => {
    if (pageNumber < pages.length) {
      goNext();
      return;
    }

    // Last page ended: stay here for now.
    // Next step: show calm "The End" overlay + button to bookshelf.
  };

  return (
    <Page>
      <Header>
        <Title>{book.title}</Title>
        <Subtitle>
          Page {pageNumber} / {pages.length}
        </Subtitle>
      </Header>

      <VideoStage
        src={pages[pageIndex].src}
        nextSrc={nextSrc}
        hasStarted={hasStarted}
        onStart={() => {
          setHasStarted(true);
        }}
        onEnded={handleEnded}
        showPrev={showPrev}
        showNext={showNext}
        onPrev={goPrev}
        onNext={goNext}
      />
    </Page>
  );
}
