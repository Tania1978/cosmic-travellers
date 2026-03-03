import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BOOKS } from "../data/books";
import type { Chapter } from "../data/books/introBook";
import { useGoldenShells } from "../GoldenShells/GoldenShellsProvider";

type Options = {
  pauseAtChapterEnd?: boolean;
  endEpsilonSeconds?: number;
  earnedThisSession: number;
};

function clampPageToChapters(chapters: { page: number }[], page: number) {
  const pages = chapters.map((c) => c.page);
  const min = Math.min(...pages);
  const max = Math.max(...pages);
  return Math.max(min, Math.min(max, page));
}

export function useChapterVideoPlayer(options: Options) {
  const START_EPSILON_SECONDS = 0.08;
  const FRAME_EPS = 0.04;

  const {
    pauseAtChapterEnd = false,
    endEpsilonSeconds = 1,
    earnedThisSession,
  } = options;

  const { bookSlug, page } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { isShellEarned, store } = useGoldenShells();

  const book = useMemo(() => {
    if (!bookSlug) return null;
    return (BOOKS as any)[bookSlug] ?? null;
  }, [bookSlug]);

  const pageNumber = useMemo(() => {
    const n = Number(page);
    return Number.isFinite(n) ? n : 1;
  }, [page]);

  const hiddenUnlocked = useMemo(() => {
    if (!book?.requiredShellIds?.length) return true;
    return book.requiredShellIds.every((id: string) => isShellEarned(id));
  }, [book, isShellEarned, store]);

  const effectiveChapters = useMemo(() => {
    if (!book) return [];
    return hiddenUnlocked
      ? book.chapters
      : book.chapters.filter((c: any) => !c.hidden);
  }, [book, hiddenUnlocked]);

  // const lastEffectiveEnd = useMemo(() => {
  //   if (effectiveChapters.length === 0) return 0;
  //   return effectiveChapters[effectiveChapters.length - 1]!.end;
  // }, [effectiveChapters]);

  // ✅ NEW: stable locked boundary end (end of last NON-hidden chapter)
  const lockedLastEnd = useMemo(() => {
    if (!book) return 0;
    const visible = book.chapters.filter((c: any) => !c.hidden);
    if (visible.length === 0) return 0;
    return visible[visible.length - 1]!.end;
  }, [book]);

  const clampedPage = useMemo(() => {
    if (!book || effectiveChapters.length === 0) return 1;
    return clampPageToChapters(effectiveChapters, pageNumber);
  }, [book, effectiveChapters, pageNumber]);

  const currentChapterIndex = useMemo(() => {
    if (!book || effectiveChapters.length === 0) return -1;
    return effectiveChapters.findIndex((c: Chapter) => c.page === clampedPage);
  }, [book, effectiveChapters, clampedPage]);

  const currentChapter: Chapter | null = useMemo(() => {
    if (!book) return null;
    if (currentChapterIndex < 0) return null;
    return (effectiveChapters[currentChapterIndex] ?? null) as Chapter | null;
  }, [book, effectiveChapters, currentChapterIndex]);

  const seekTo = useCallback((t: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = t;
  }, []);

  const goToPage = useCallback(
    (targetPage: number, replace = false) => {
      if (!book || effectiveChapters.length === 0) return;
      const clamped = clampPageToChapters(effectiveChapters, targetPage);
      navigate(`/${book.slug}/${clamped}`, { replace });
    },
    [book, effectiveChapters, navigate],
  );

  const goNext = useCallback(() => {
    if (!book || currentChapterIndex < 0) return;
    const next = effectiveChapters[currentChapterIndex + 1];
    if (!next) return;
    goToPage(next.page);
  }, [book, currentChapterIndex, effectiveChapters, goToPage]);

  const goPrev = useCallback(() => {
    if (!book || currentChapterIndex < 0) return;
    const prev = effectiveChapters[currentChapterIndex - 1];
    if (!prev) return;
    goToPage(prev.page);
  }, [book, currentChapterIndex, effectiveChapters, goToPage]);

  useEffect(() => {
    if (!book) return;
    if (clampedPage !== pageNumber) {
      navigate(`/${book.slug}/${clampedPage}`, { replace: true });
    }
  }, [book, clampedPage, pageNumber, navigate]);

  const [chapterEnded, setChapterEnded] = useState(false);

  useEffect(() => {
    setChapterEnded(false);
  }, [clampedPage]);

  useEffect(() => {
    if (!book) return;
    if (!currentChapter) return;

    const v = videoRef.current;
    if (!v) return;

    const currentTime = v.currentTime || 0;

    const target =
      currentChapter.start +
      (currentChapterIndex === 0 ? 0 : START_EPSILON_SECONDS);

    const safeTarget = Math.min(target, currentChapter.end - FRAME_EPS);

    const alreadyNear = Math.abs(currentTime - safeTarget) < 0.25;
    if (!alreadyNear) {
      seekTo(safeTarget);
    }
  }, [book, currentChapter, currentChapterIndex, seekTo]);

  useEffect(() => {
    if (!book) return;
    if (effectiveChapters.length === 0) return;

    const isAllowed = effectiveChapters.some(
      (c: Chapter) => c.page === pageNumber,
    );
    if (!isAllowed) {
      const fallback = clampPageToChapters(effectiveChapters, pageNumber);
      console.warn("[Player] Blocked illegal page:", pageNumber, "→", fallback);
      navigate(`/${book.slug}/${fallback}`, { replace: true });
    }
  }, [book, effectiveChapters, pageNumber, navigate]);

  // -------------------------
  // ✅ AUTO-UNLOCK + AUTOPLAY
  // -------------------------
  const prevHiddenUnlockedRef = useRef<boolean>(hiddenUnlocked);
  const autoplayPendingRef = useRef(false);
  const targetAutoplayPageRef = useRef<number | null>(null);

  useEffect(() => {
    if (!book) return;

    const was = prevHiddenUnlockedRef.current;
    const now = hiddenUnlocked;
    prevHiddenUnlockedRef.current = now;

    if (was || !now) return;

    const v = videoRef.current;
    if (!v) return;

    const firstHidden = book.chapters.find((c: any) => c.hidden);
    if (!firstHidden) return;

    const EPS = 0.12;

    // ✅ FIX: boundary check must use locked end, not lastEffectiveEnd (which changes on unlock)
    const atBoundary =
      Math.abs(v.currentTime - lockedLastEnd) < EPS ||
      v.currentTime >= lockedLastEnd - EPS;

    if (!atBoundary) return;

    autoplayPendingRef.current = true;
    targetAutoplayPageRef.current = firstHidden.page;

    setChapterEnded(false);
    goToPage(firstHidden.page, true);
  }, [book, hiddenUnlocked, lockedLastEnd, goToPage]);

  useEffect(() => {
    if (!autoplayPendingRef.current) return;
    const targetPage = targetAutoplayPageRef.current;
    if (!targetPage) return;

    if (!currentChapter) return;
    if (currentChapter.page !== targetPage) return;

    const v = videoRef.current;
    if (!v) return;

    const target =
      currentChapter.start +
      (currentChapterIndex === 0 ? 0 : START_EPSILON_SECONDS);

    const safeTarget = Math.min(target, currentChapter.end - FRAME_EPS);
    v.currentTime = safeTarget;

    requestAnimationFrame(() => {
      v.play().catch(() => {});
      autoplayPendingRef.current = false;
      targetAutoplayPageRef.current = null;
    });
  }, [currentChapter, currentChapterIndex]);

  const onTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !currentChapter) return;

    const t = v.currentTime;

    if (t < currentChapter.start + 0.2 && chapterEnded) {
      setChapterEnded(false);
    }

    if (!chapterEnded && t >= currentChapter.end - endEpsilonSeconds) {
      setChapterEnded(true);

      const next = effectiveChapters[currentChapterIndex + 1];

      if (!next) {
        const clamp = Math.max(
          currentChapter.start,
          currentChapter.end - FRAME_EPS,
        );
        v.pause();
        v.currentTime = clamp;
        return;
      }

      if (pauseAtChapterEnd) {
        const clamp = Math.max(
          currentChapter.start,
          currentChapter.end - FRAME_EPS,
        );
        v.pause();
        v.currentTime = clamp;
        return;
      }

      const isGratitudeChapter =
        (next as any).kind === "gratitude" || next.page === 999;
      if (isGratitudeChapter && earnedThisSession === 0) {
        v.pause();
        return;
      }

      goToPage(next.page, true);
    }
  }, [
    chapterEnded,
    currentChapter,
    currentChapterIndex,
    effectiveChapters,
    endEpsilonSeconds,
    goToPage,
    pauseAtChapterEnd,
    earnedThisSession,
  ]);

  const onLoadedMetadata = useCallback(() => {
    if (!currentChapter) return;
    const v = videoRef.current;
    if (!v) return;

    const t = v.currentTime || 0;
    const target =
      currentChapter.start +
      (currentChapterIndex === 0 ? 0 : START_EPSILON_SECONDS);

    const safeTarget = Math.min(target, currentChapter.end - FRAME_EPS);

    if (Math.abs(t - safeTarget) > 0.25) {
      seekTo(safeTarget);
    }
  }, [currentChapter, currentChapterIndex, seekTo]);

  return {
    book,
    videoRef,
    currentChapter,
    currentChapterIndex,
    pageNumber: clampedPage,
    goToPage,
    goNext,
    goPrev,
    onTimeUpdate,
    onLoadedMetadata,
    chapterEnded,
    hiddenUnlocked,
    effectiveChapters,
  };
}
