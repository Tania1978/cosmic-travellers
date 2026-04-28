import { useParams } from "react-router-dom";
import { GoldenShellsProvider } from "../../GoldenShells/GoldenShellsProvider";
import { useMemo } from "react";
import { BOOKSPAGES } from "../books/introBook";

export function GoldenShellsProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { bookSlug } = useParams();

  const foundBook = useMemo(
    () => BOOKSPAGES.find((b) => b.slug === bookSlug),
    [bookSlug],
  );
  console.log("foundBook", foundBook);

  if (!bookSlug || !foundBook) return null;

  return (
    <GoldenShellsProvider
      bookletId={bookSlug}
      requiredShellIds={foundBook.requiredShellIds ?? []}
      shellCompletionVideoSrc={foundBook?.shellCompletionVideoSrc}
    >
      {children}
    </GoldenShellsProvider>
  );
}
