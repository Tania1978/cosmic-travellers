import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Bookshelf } from "./pages/Bookshelf";
//import BookPlayerPage from "./pages/BookPlayerPage";
import WriterNotes from "./pages/WriterNotes";
import Credits from "./pages/Credits";
import { TEXTPAGES } from "./data/books/text-pages";
//import { GoldenShellsProviderWrapper } from "./data/shells/GoldenShellsProviderWrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ReviewsPage } from "./pages/ReviewPage";
import { JourneyActions } from "./components/JourneyActions";
import { PreviewAccess } from "./components/PreviewAccess";
import { Trigger } from "./theme/sharedStyled";
import { InfoButton } from "./components/InfoButton";
import { MessageButton } from "./components/MessageButton";
import styled from "styled-components";
import { useAuth } from "./auth/authContext";
import { GoldenShellsProviderWrapper } from "./data/shells/GoldenShellsProviderWrapper";
import BookPlayerPage from "./pages/BookPlayerPage";

export default function AppRoutes() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { isLoggedIn } = useAuth();

  const inHomePage = routerLocation.pathname === "/";

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />

            <JourneyActions>
              <MessageButton iconSrc={"/ui/message-button1.png"} size={150} />
              <InfoButton />
              {inHomePage && isLoggedIn && (
                <ButtonSlot id="button slot">
                  <PreviewAccess />
                </ButtonSlot>
              )}
              <ButtonSlot>
                <Trigger onClick={() => navigate("/reviews")}>Reviews</Trigger>
              </ButtonSlot>
            </JourneyActions>

            <Bookshelf />

            <Footer />
          </>
        }
      />

      <Route
        path="/writer-notes"
        element={
          <>
            <Header />
            <WriterNotes data={TEXTPAGES["/writer-notes"]} />
            <Footer />
          </>
        }
      />
      <Route
        path="/reviews"
        element={
          <>
            <Header />
            <ReviewsPage />
            <Footer />
          </>
        }
      />
      <Route
        path="/art-credits"
        element={
          <>
            <Header />
            <Credits data={TEXTPAGES["/art-credits"]} />
            <Footer />
          </>
        }
      />
      {/* <Route
        path="/:bookSlug/:page"
        element={
          <GoldenShellsProviderWrapper>
            <Header />
            <JourneyActions>
              <MessageButton iconSrc={"/ui/message-button.png"} size={150} />
              <InfoButton />
            </JourneyActions>
            <BookPlayerPage />
            <Footer />
          </GoldenShellsProviderWrapper>
        }
      /> */}
      <Route
        path="/:bookSlug/:page"
        element={
          <GoldenShellsProviderWrapper>
            <Header />
            {/* <JourneyActions>
              <MessageButton iconSrc={"/ui/message-button.png"} size={150} />
              <InfoButton />
            </JourneyActions> */}
            <BookPlayerPage />
            <Footer />
          </GoldenShellsProviderWrapper>
        }
      />
      <Route path="*" element={<div>Route not found</div>} />
    </Routes>
  );
}

const ButtonSlot = styled.div`
  width: 180px;

  display: flex;
  align-items: center;
`;
