import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BOOKS } from "../data/books";
import type { BookConfig, Chapter } from "../data/books/introBook";

type Options = {
  pauseAtChapterEnd?: boolean; // bedtime mode
  endEpsilonSeconds?: number; // tolerance for timeupdate comparisons
  earnedThisSession: number;
};

function clampPageToBook(book: BookConfig, page: number) {
  const pages = book.chapters.map((c) => c.page);
  const min = Math.min(...pages);
  const max = Math.max(...pages);
  return Math.max(min, Math.min(max, page));
}

export function useChapterVideoPlayer(options: Options) {
  const {
    pauseAtChapterEnd = false,
    endEpsilonSeconds = 0.12,
    earnedThisSession,
  } = options;

  const { bookSlug, page } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const book = useMemo(() => {
    if (!bookSlug) return null;
    return BOOKS[bookSlug] ?? null;
  }, [bookSlug]);

  console.log("book", book);

  const pageNumber = useMemo(() => {
    const n = Number(page);
    return Number.isFinite(n) ? n : 1;
  }, [page]);

  const currentChapterIndex = useMemo(() => {
    if (!book) return -1;
    const clamped = clampPageToBook(book, pageNumber);
    return book.chapters.findIndex((c) => c.page === clamped);
  }, [book, pageNumber]);

  console.log("currentChapterIndex", currentChapterIndex);

  const currentChapter: Chapter | null = useMemo(() => {
    if (!book) return null;
    if (currentChapterIndex < 0) return null;
    return book.chapters[currentChapterIndex] ?? null;
  }, [book, currentChapterIndex]);

  console.log("currentChapter", currentChapter);

  // Prevent repeat-seek loops
  const lastSeekTargetRef = useRef<number | null>(null);

  const seekTo = useCallback((t: number) => {
    console.log("seekTo fucntion called param t", t);
    const v = videoRef.current;
    if (!v) return;
    lastSeekTargetRef.current = t;
    // set currentTime directly; video must be loaded enough but browser will handle pending seeks
    v.currentTime = t;
  }, []);

  const goToPage = useCallback(
    (targetPage: number, replace = false) => {
      console.log("GO TO PAGE CALLED TO KEEP PLAYING");
      if (!book) return;
      const clamped = clampPageToBook(book, targetPage);
      navigate(`/${book.slug}/${clamped}`, { replace });
    },
    [book, navigate],
  );

  const goNext = useCallback(() => {
    if (!book || currentChapterIndex < 0) return;
    const next = book.chapters[currentChapterIndex + 1];
    if (!next) return;
    goToPage(next.page);
  }, [book, currentChapterIndex, goToPage]);

  const goPrev = useCallback(() => {
    if (!book || currentChapterIndex < 0) return;
    const prev = book.chapters[currentChapterIndex - 1];
    if (!prev) return;
    goToPage(prev.page);
  }, [book, currentChapterIndex, goToPage]);

  // When route (page) changes, seek to that chapter start
  useEffect(() => {
    if (!book) return;
    const clamped = clampPageToBook(book, pageNumber);
    console.log("clamped in useeffect", clamped);
    console.log("pageNumber", pageNumber);
    if (clamped !== pageNumber) {
      goToPage(clamped, true);
      return;
    }
    if (!currentChapter) return;

    const v = videoRef.current;
    if (!v) return;

    // only seek if we're not already close
    const currentTime = v.currentTime || 0;
    const target = currentChapter.start;
    const alreadyNear = Math.abs(currentTime - target) < 0.25;

    if (!alreadyNear) seekTo(target);
  }, [book, pageNumber, currentChapter, goToPage, seekTo]);

  // End-of-chapter handling
  const [chapterEnded, setChapterEnded] = useState(false);
  console.log("chapterEnded", chapterEnded);

  const onTimeUpdate = useCallback(() => {
    console.log("ontimeupdate funcitn called");
    const v = videoRef.current;
    if (!v || !currentChapter) return;

    const t = v.currentTime;
    console.log("t", t);

    // Reset end flag if user seeks backwards or enters new chapter
    if (t < currentChapter.start + 0.2 && chapterEnded) {
      setChapterEnded(false);
    }

    if (!chapterEnded && t >= currentChapter.end - endEpsilonSeconds) {
      setChapterEnded(true);

      if (pauseAtChapterEnd) {
        v.pause();
        // snap to end for clean stillness
        v.currentTime = currentChapter.end;
      } else {
        const next = book?.chapters[currentChapterIndex + 1];
        console.log("next", next);
        if (next) {
          console.log("in if to play next video");
          const isGratitudeChapter =
            next.kind === "gratitude" || next.page === 999; // pick one convention
          console.log(isGratitudeChapter);

          if (isGratitudeChapter && earnedThisSession === 0) {
            console.log("in if of gratitude chapter to pause");
            v.pause();
            return;
          }

          goToPage(next.page, true);
        }
      }
    }
  }, [
    book,
    chapterEnded,
    currentChapter,
    currentChapterIndex,
    endEpsilonSeconds,
    goToPage,
    pauseAtChapterEnd,
    earnedThisSession, // ✅ add dependency
  ]);

  const onLoadedMetadata = useCallback(() => {
    // after metadata is ready, ensure we’re at the correct start
    if (!currentChapter) return;
    const v = videoRef.current;
    if (!v) return;

    const t = v.currentTime || 0;
    const target = currentChapter.start;
    if (Math.abs(t - target) > 0.25) seekTo(target);
  }, [currentChapter, seekTo]);

  return {
    book,
    videoRef,
    currentChapter,
    currentChapterIndex,
    pageNumber,
    goToPage,
    goNext,
    goPrev,
    onTimeUpdate,
    onLoadedMetadata,
    chapterEnded,
  };
}
