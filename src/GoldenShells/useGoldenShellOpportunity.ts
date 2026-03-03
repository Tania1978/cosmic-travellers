import { useEffect, useMemo, useRef, useState } from "react";
import { useGoldenShells } from "./GoldenShellsProvider";
import type { ShellOpportunity } from "./types";

type RevealConfig =
  | { type: "immediate" }
  | {
      type: "chapterEnd";
      videoRef: React.RefObject<HTMLVideoElement | null>;
      chapterEnd: number;
      buffer?: number;
    };

export function useGoldenShellOpportunity(opts: {
  page: number;
  opportunities: ShellOpportunity[];
  reveal?: RevealConfig;
}) {
  const { page, opportunities } = opts;
  const reveal: RevealConfig = opts.reveal ?? { type: "immediate" };

  const {
    setActiveOpportunity,
    isShellEarned,
    activeOpportunity,
    isModalOpen,
  } = useGoldenShells();

  // ✅ state drives renders
  const [revealedOppId, setRevealedOppId] = useState<string | null>(null);

  // ✅ optional ref for event handler reads (no re-render needed)
  const revealedOppIdRef = useRef<string | null>(null);
  useEffect(() => {
    revealedOppIdRef.current = revealedOppId;
  }, [revealedOppId]);

  const oppsForPage = useMemo(
    () => opportunities.filter((o) => o.page === page),
    [opportunities, page],
  );

  // sticky: if something was revealed, keep showing it (regardless of page)
  const stickyOpp = useMemo(() => {
    if (!revealedOppId) return null;
    return opportunities.find((o) => o.id === revealedOppId) ?? null;
  }, [opportunities, revealedOppId]);

  const nextUnEarnedOpp = useMemo(() => {
    return oppsForPage.find((o) => !isShellEarned(o.id)) ?? null;
  }, [oppsForPage, isShellEarned]);

  // ✅ Keep sticky visible until earned
  useEffect(() => {
    if (!stickyOpp) return;

    if (isShellEarned(stickyOpp.id)) {
      setActiveOpportunity(null);
      setRevealedOppId(null);
      return;
    }
    if (isModalOpen) return;
    setActiveOpportunity(stickyOpp);
  }, [stickyOpp, isShellEarned, setActiveOpportunity]);

  // ✅ Also clear when current active opp becomes earned (covers UI timing)
  useEffect(() => {
    if (!activeOpportunity) return;
    if (!isShellEarned(activeOpportunity.id)) return;

    setActiveOpportunity(null);
    setRevealedOppId(null);
  }, [activeOpportunity, isShellEarned, setActiveOpportunity]);

  // Immediate reveal (only if nothing is currently revealed)
  useEffect(() => {
    if (reveal.type !== "immediate") return;
    if (revealedOppIdRef.current) return;
    if (!nextUnEarnedOpp) return;

    setRevealedOppId(nextUnEarnedOpp.id);
    if (isModalOpen) return;
    setActiveOpportunity(nextUnEarnedOpp);
  }, [nextUnEarnedOpp, reveal.type, setActiveOpportunity]);

  // Reveal at chapter end (only if nothing is currently revealed)
  useEffect(() => {
    if (reveal.type !== "chapterEnd") return;
    if (revealedOppIdRef.current) return;
    if (!nextUnEarnedOpp) return;

    const video = reveal.videoRef.current;
    if (!video) return;

    const buffer = reveal.buffer ?? 0.3;
    const revealAt = Math.max(0, reveal.chapterEnd - buffer);

    const tryReveal = () => {
      if (revealedOppIdRef.current) return;

      if (video.currentTime >= revealAt) {
        setRevealedOppId(nextUnEarnedOpp.id);
        if (isModalOpen) return;
        setActiveOpportunity(nextUnEarnedOpp);
      }
    };

    video.addEventListener("timeupdate", tryReveal);
    video.addEventListener("seeked", tryReveal);
    video.addEventListener("ended", tryReveal);

    tryReveal();

    return () => {
      video.removeEventListener("timeupdate", tryReveal);
      video.removeEventListener("seeked", tryReveal);
      video.removeEventListener("ended", tryReveal);
    };
  }, [nextUnEarnedOpp, reveal, setActiveOpportunity]);
}
