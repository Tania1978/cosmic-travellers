import { useParams } from "react-router-dom";
import { GoldenShellsProvider } from "../../GoldenShells/GoldenShellsProvider";

export function GoldenShellsProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { bookSlug } = useParams();

  if (!bookSlug) return null;

  return (
    <GoldenShellsProvider bookletId={bookSlug}>{children}</GoldenShellsProvider>
  );
}
