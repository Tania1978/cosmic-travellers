// useGoldenShellOpportunity.ts
import { useEffect } from "react";

import { useGoldenShells } from "./GoldenShellsProvider";
import type { ShellOpportunity } from "./types";

export function useGoldenShellOpportunity(params: {
  page: number;
  opportunities: ShellOpportunity[];
}) {
  const { page, opportunities } = params;
  const { setActiveOpportunity, isShellEarned } = useGoldenShells();

  useEffect(() => {
    const opp = opportunities.find((o) => o.page === page) ?? null;
    console.log("opportunity", opp);
    if (!opp) return setActiveOpportunity(null);
    if (isShellEarned(opp.id)) return setActiveOpportunity(null);
    setActiveOpportunity(opp);
  }, [page, opportunities, setActiveOpportunity, isShellEarned]);
}
