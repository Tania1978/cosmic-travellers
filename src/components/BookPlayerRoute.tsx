import Header from "./Header";
import Footer from "./Footer";
import { GoldenShellsProviderWrapper } from "../data/shells/GoldenShellsProviderWrapper";
import BookPlayerPage from "../pages/BookPlayerPage";
import { BookPlayerErrorBoundary } from "../pages/BookPlayerErrorBoundary";

import styled from "styled-components";

const PageLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const BookPlayerRouteShell = styled.main`
  min-height: 100vh;
  width: 100%;
  display: flex;
  margin-top: 40px;
  justify-content: center;
`;

interface IBookPlayerPageProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BookPlayerRoute({
  isPlaying,
  setIsPlaying,
}: IBookPlayerPageProps) {
  return (
    <GoldenShellsProviderWrapper>
      <PageLayout>
        <Header isPlaying={isPlaying} />
        <BookPlayerErrorBoundary>
          <BookPlayerRouteShell>
            <BookPlayerPage setIsPlaying={setIsPlaying} isPlaying={isPlaying} />
          </BookPlayerRouteShell>
        </BookPlayerErrorBoundary>

        <Footer />
      </PageLayout>
    </GoldenShellsProviderWrapper>
  );
}
