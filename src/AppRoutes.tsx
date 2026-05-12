import { Navigate, Route, Routes } from "react-router-dom";
import { Bookshelf } from "./pages/Bookshelf";
import BookPlayerPage from "./pages/BookPlayerPage";
import WriterNotes from "./pages/WriterNotes";
import Credits from "./pages/Credits";
import { TEXTPAGES } from "./data/books/text-pages";
import { GoldenShellsProviderWrapper } from "./data/shells/GoldenShellsProviderWrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ReviewsPage } from "./pages/ReviewPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />
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

      <Route
        path="/:bookSlug/:page"
        element={
          <GoldenShellsProviderWrapper>
            <Header />
            <BookPlayerPage />
            <Footer />
          </GoldenShellsProviderWrapper>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
