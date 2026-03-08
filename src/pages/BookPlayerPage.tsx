import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function BookPlayerPage() {
  const { bookSlug, page } = useParams();
  const location = useLocation();

  useEffect(() => {
    console.log("BookPlayerPage mounted/updated", {
      bookSlug,
      page,
      pathname: location.pathname,
    });
  }, [bookSlug, page, location.pathname]);

  return (
    <div>
      <div>bookSlug: {bookSlug}</div>
      <div>page: {page}</div>
      <div>pathname: {location.pathname}</div>
    </div>
  );
}
