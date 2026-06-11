import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Bookshelf } from "./pages/Bookshelf";
import WriterNotes from "./pages/WriterNotes";
import Credits from "./pages/Credits";
import { TEXTPAGES } from "./data/books/text-pages";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ReviewsPage } from "./pages/ReviewPage";
import { JourneyActions } from "./components/JourneyActions";
import { PreviewAccess } from "./components/PreviewAccess";
import { Trigger } from "./theme/sharedStyled";
import { InfoButton } from "./components/InfoButton";
import { MessageButton } from "./components/MessageButton";
import { useAuth } from "./auth/authContext";
import { AuthCallback } from "./auth/AuthCallback";
import { BookPlayerRoute } from "./components/BookPlayerRoute";
import { useState } from "react";

export default function AppRoutes() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { isLoggedIn } = useAuth();
  const [isPlaying, setIsPlaying] = useState<boolean | null>(null);

  const inHomePage = routerLocation.pathname === "/";

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header isPlaying={false} />

            <JourneyActions>
              <MessageButton
                iconSrc={"/ui/message-button.png"}
                size={150}
                isPlaying={false}
              />
              <InfoButton />
              {inHomePage && isLoggedIn && <PreviewAccess />}

              <Trigger onClick={() => navigate("/reviews")} width={"40%"}>
                Reviews
              </Trigger>
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
            <Header isPlaying={isPlaying} />
            <Credits data={TEXTPAGES["/art-credits"]} />
            <Footer />
          </>
        }
      />
      <Route
        path="/:bookSlug/:page"
        element={
          <BookPlayerRoute isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        }
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<div>Route not found</div>} />
    </Routes>
  );
}
