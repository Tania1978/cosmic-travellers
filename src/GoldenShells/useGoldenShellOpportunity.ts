// useGoldenShellOpportunity.ts
import { useEffect, useMemo, useRef } from "react";

import { useGoldenShells } from "./GoldenShellsProvider";
import type { ShellOpportunity } from "./types";

type RevealConfig =
  | { type: "immediate" }
  | {
      type: "chapterEnd";
      videoRef: React.RefObject<HTMLVideoElement | null>;
      chapterEnd: number;
      buffer?: number; // seconds before end
    };

export function useGoldenShellOpportunity(opts: {
  page: number;
  opportunities: ShellOpportunity[];
  reveal?: RevealConfig;
}) {
  const { page, opportunities } = opts;
  const reveal: RevealConfig = opts.reveal ?? { type: "immediate" };

  const { setActiveOpportunity, isShellEarned } = useGoldenShells();

  const oppForPage = useMemo(() => {
    // assuming opportunities include page
    return opportunities.find((o) => o.page === page) ?? null;
  }, [opportunities, page]);

  const revealedForPageRef = useRef<number | null>(null);

  // Always clear on page change
  useEffect(() => {
    setActiveOpportunity(null);
    revealedForPageRef.current = null;
  }, [page, setActiveOpportunity]);

  // If no opp or already earned, keep it hidden
  useEffect(() => {
    if (!oppForPage) return;
    if (isShellEarned(oppForPage.id)) return;

    if (reveal.type === "immediate") {
      setActiveOpportunity(oppForPage);
      revealedForPageRef.current = page;
    }
  }, [oppForPage, reveal.type, isShellEarned, page, setActiveOpportunity]);

  // Reveal at chapter end
  useEffect(() => {
    if (!oppForPage) return;
    if (isShellEarned(oppForPage.id)) return;
    if (reveal.type !== "chapterEnd") return;

    const video = reveal.videoRef.current;
    if (!video) return;

    const buffer = reveal.buffer ?? 0.3;
    console.log(buffer, "buffer");
    const revealAt = Math.max(0, reveal.chapterEnd - buffer);
    console.log(revealAt, "revealAt");
    const onTimeUpdate = () => {
      console.log("revealedForPageRef.current", revealedForPageRef.current);
      console.log("page", page);
      if (revealedForPageRef.current === page) return;

      if (video.currentTime >= revealAt) {
        revealedForPageRef.current = page;
        setActiveOpportunity(oppForPage);
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [oppForPage, isShellEarned, page, reveal, setActiveOpportunity]);
}
