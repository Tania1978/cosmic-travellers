import { Navigate, Route, Routes } from "react-router-dom";
import { Bookshelf } from "./pages/Bookshelf";
import BookPlayerPage from "./pages/BookPlayerPage";
import About from "./pages/About";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Bookshelf />} />
      <Route path="/writer-notes" element={<About />} />
      <Route path="/:bookSlug/:page" element={<BookPlayerPage />} />

      {/* nice fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
