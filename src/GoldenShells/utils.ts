import { BOOKLET2_SHELLS } from "../data/shells/shells_opportunitites";
import { useGoldenShellOpportunity } from "./useGoldenShellOpportunity";

export function ShellOpportunityBinder({ page }: { page: number }) {
  useGoldenShellOpportunity({
    page,
    opportunities: BOOKLET2_SHELLS, // swap per book if needed
  });
  return null;
}
