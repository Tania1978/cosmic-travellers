
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { Bookshelf } from "./pages/Bookshelf";
import { BookPageRoute } from "./pages/BookPageRoute";

function BookToFirstPage() {
  const { bookSlug } = useParams();
  return <Navigate to={`/${bookSlug}/1`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Bookshelf />} />
        <Route path="/:bookSlug" element={<BookToFirstPage />} />
        <Route path="/:bookSlug/:page" element={<BookPageRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
