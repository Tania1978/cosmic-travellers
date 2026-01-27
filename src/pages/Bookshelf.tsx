import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BOOKS } from "../data/books/books";

const Background = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;

  background-image: url("/ui/bg1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Page = styled.div`
  padding: 24px;
  max-width: 1100px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin: auto;
  font-size: 30px;
`;

const Grid = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
`;

const CardButton = styled.button<{ $locked?: boolean }>`
  padding: 0;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.25);
  cursor: ${({ $locked }) => ($locked ? "not-allowed" : "pointer")};
  opacity: ${({ $locked }) => ($locked ? 0.5 : 1)};
`;

const Thumb = styled.div`
  aspect-ratio: 1/1;
  background: #000;
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const BookTitle = styled.p`
  font-size: 20px;
  margin: 0;
  font-style: bold;
`;

const BookSubTitle = styled.p`
  font-size: 18px;
  margin: 0;
  font-style: italic;
`;

export function Bookshelf() {
  const navigate = useNavigate();

  return (
    <>
      <Background />
      <Page>
        <div style={{ textAlign: "center" }}>
          <Title>The Cosmic Travellers and the Secrets of Life</Title>
        </div>

        <Grid>
          {BOOKS.map((b) => (
            <Grid>
              <CardButton
                key={b.slug}
                onClick={() => navigate(`/${b.slug}/1`)}
                disabled={b.isLocked}
                $locked={b.isLocked}
                aria-label={`Open ${b.title}`}
              >
                <Thumb>
                  <ThumbImg src={b.thumbnailSrc} alt={b.title} />
                </Thumb>
              </CardButton>
              <BookTitle>{b.title}</BookTitle>
              <BookSubTitle>{b.subtitle}</BookSubTitle>
            </Grid>
          ))}
        </Grid>
      </Page>
    </>
  );
}
