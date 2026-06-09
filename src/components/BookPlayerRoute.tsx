import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

import { JourneyActions } from "./JourneyActions";
import { PreviewAccess } from "./PreviewAccess";
import { Trigger } from "../theme/sharedStyled";
import { InfoButton } from "./InfoButton";
import { MessageButton } from "./MessageButton";

import { useAuth } from "../auth/authContext";
import { GoldenShellsProviderWrapper } from "../data/shells/GoldenShellsProviderWrapper";
import BookPlayerPage from "../pages/BookPlayerPage";
import { BookPlayerErrorBoundary } from "../pages/BookPlayerErrorBoundary";

import { useState } from "react";
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

export function BookPlayerRoute() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <GoldenShellsProviderWrapper>
      <PageLayout>
        <Header />

        {!isPlaying && (
          <JourneyActions>
            <MessageButton
              iconSrc="/ui/message-button.png"
              size={150}
              isPlaying={isPlaying}
            />
            <InfoButton />

            {isLoggedIn && <PreviewAccess />}

            <Trigger onClick={() => navigate("/reviews")} width={"50%"}>
              Reviews
            </Trigger>
          </JourneyActions>
        )}

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
