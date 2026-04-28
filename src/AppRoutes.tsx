import { Navigate, Route, Routes } from "react-router-dom";
import { Bookshelf } from "./pages/Bookshelf";
import BookPlayerPage from "./pages/BookPlayerPage";
import WriterNotes from "./pages/WriterNotes";
import Credits from "./pages/Credits";
import { TEXTPAGES } from "./data/books/text-pages";
import { GoldenShellsProviderWrapper } from "./data/shells/GoldenShellsProviderWrapper";
import Header from "./components/Header";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Bookshelf />} />
      <Route
        path="/writer-notes"
        element={
        <WriterNotes data={TEXTPAGES["/writer-notes"]} />}
      />
      <Route
        path="/art-credits"
        element={<Credits data={TEXTPAGES["/art-credits"]} />}
      />
      <Route
        path="/:bookSlug/:page"
        element={
          <GoldenShellsProviderWrapper>
            <Header />
            <BookPlayerPage />
          </GoldenShellsProviderWrapper>
        }
      />

      {/* nice fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
