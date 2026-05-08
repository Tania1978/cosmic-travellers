import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { DISABLE_VIDEO } from "../config/features";

import { CustomIconButton } from "../components/CustomIconButton";
import PageBackground from "../components/PageBackground";
import { useTranslation } from "react-i18next";
import { useGoldenShells } from "../GoldenShells/GoldenShellsProvider";
import { BOOKS as BOOK_CONFIGS } from "../data/books";
import { BOOKSPAGES } from "../data/books/introBook";
import { ALL_SHELL_OPPORTUNITIES } from "../data/shells/shells_opportunitites";

import { GoldenShellIcon } from "../GoldenShells/GoldenShellIcon";
import { GoldenShellModal } from "../GoldenShells/GoldenShellModal";

const CHAPTER_PREROLL_SECONDS = 0.5;

export default function BookPlayerPage() {
  const { bookSlug, page } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { isModalOpen, correctSoundRef, setActiveOpportunity, isShellEarned } =
    useGoldenShells();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const wasPlayingRef = useRef(false);

  const [videoTime, setVideoTime] = useState(0);
  const [pendingManualPage, setPendingManualPage] = useState<number | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const currentPage = Number(page);

  const isValidSlug = !!bookSlug && !!BOOK_CONFIGS[bookSlug];

  const foundBook = useMemo(
    () => BOOKSPAGES.find((book) => book.slug === bookSlug),
    [bookSlug],
  );

  const chapterNow = useMemo(() => {
    return foundBook?.chapters.find((chapter) => chapter.page === currentPage);
  }, [foundBook, currentPage]);

  const currentChapterIndex = useMemo(() => {
    if (!foundBook) return -1;

    return foundBook.chapters.findIndex(
      (chapter) => chapter.page === currentPage,
    );
  }, [foundBook, currentPage]);

  const nextChapter = useMemo(() => {
    if (!foundBook || currentChapterIndex < 0) return undefined;

    return foundBook.chapters[currentChapterIndex + 1];
  }, [foundBook, currentChapterIndex]);

  const prevChapter = useMemo(() => {
    if (!foundBook || currentChapterIndex <= 0) return undefined;

    return foundBook.chapters[currentChapterIndex - 1];
  }, [foundBook, currentChapterIndex]);

  const shellOpportunities = useMemo(() => {
    if (!foundBook?.requiredShellIds?.length) return [];

    return ALL_SHELL_OPPORTUNITIES.filter((shell: any) =>
      foundBook.requiredShellIds?.includes(shell.id),
    );
  }, [foundBook]);

  const shellForCurrentPage = useMemo(() => {
    return (
      shellOpportunities.find((shell) => {
        if (shell.page !== currentPage) return false;
        if (isShellEarned(shell.id)) return false;

        return true;
      }) ?? null
    );
  }, [shellOpportunities, currentPage, isShellEarned]);

  const goToChapter = (targetPage: number) => {
    setPendingManualPage(targetPage);
    navigate(`/${bookSlug}/${targetPage}`);
  };

  const goNext = () => {
    if (!nextChapter) return;

    goToChapter(nextChapter.page);
  };

  const goPrev = () => {
    if (!prevChapter) return;

    goToChapter(prevChapter.page);
  };

  /**
   * Modal behavior:
   * - opening modal pauses video
   * - closing modal resumes only if video was playing before
   * - never changes currentTime
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isModalOpen) {
      wasPlayingRef.current = !video.paused && !video.ended;
      video.pause();
      return;
    }

    if (wasPlayingRef.current) {
      video.play().catch(() => {});
    }

    wasPlayingRef.current = false;
  }, [isModalOpen]);

  /**
   * Manual URL/page navigation:
   * - refresh
   * - typed URL
   * - next/prev buttons
   *
   * In these cases, URL wins and video seeks to chapter start.
   */
  useEffect(() => {
    if (!isVideoReady) {
      return;
    }

    if (!foundBook || !bookSlug || !chapterNow) {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    // MANUAL NAVIGATION
    if (pendingManualPage === currentPage) {
      const startTime = Math.max(0, chapterNow.start - CHAPTER_PREROLL_SECONDS);
      video.currentTime = startTime;
      setVideoTime(startTime);
      setPendingManualPage(null);

      return;
    }

    if (pendingManualPage !== null) {
      return;
    }

    // PLAYBACK SYNC
    const actualVideoTime = video.currentTime;
    const actualTimeBelongsToCurrentUrlPage =
      actualVideoTime >= chapterNow.start - CHAPTER_PREROLL_SECONDS &&
      actualVideoTime < chapterNow.end;

    if (actualTimeBelongsToCurrentUrlPage) {
      return;
    }

    const chapterForVideoTime = foundBook.chapters.find(
      (chapter) =>
        actualVideoTime >= chapter.start && actualVideoTime < chapter.end,
    );

    if (!chapterForVideoTime) {
      return;
    }

    if (chapterForVideoTime.page === currentPage) {
      return;
    }
    navigate(`/${bookSlug}/${chapterForVideoTime.page}`, {
      replace: true,
    });
  }, [
    isVideoReady,
    foundBook,
    bookSlug,
    chapterNow,
    currentPage,
    videoTime,
    pendingManualPage,
    navigate,
  ]);
  /**
   * Fullscreen listener.
   */
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFsChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, []);

  /**
   * Disabled video safety.
   */
  useEffect(() => {
    if (DISABLE_VIDEO) {
      setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = async () => {
    if (DISABLE_VIDEO) return;

    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.log("play/pause error", error);
    }
  };

  const toggleFullscreen = async () => {
    const frame = frameRef.current;
    const video = videoRef.current;

    try {
      if (video && (video as any).webkitEnterFullscreen) {
        (video as any).webkitEnterFullscreen();
        return;
      }

      if (!document.fullscreenElement) {
        await frame?.requestFullscreen?.();
      } else {
        await document.exitFullscreen();
      }
    } catch (error: any) {
      console.log(`Fullscreen error: ${error?.message || error}`);
    }
  };

  const maybeShowShell = useCallback(() => {
    const video = videoRef.current;

    if (!video) return;
    if (!chapterNow) return;
    if (isModalOpen) return;
    if (!shellForCurrentPage) return;

    const shellMoment = chapterNow.end - 1;

    if (video.currentTime >= shellMoment) {
      setActiveOpportunity(shellForCurrentPage);
    }
  }, [chapterNow, isModalOpen, shellForCurrentPage, setActiveOpportunity]);
  /**
   * Time update behavior:
   * - keeps progress bar synced
   * - shows shell icon when video reaches shell moment
   * - does NOT navigate
   * - does NOT seek
   */
  const handleTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;

      setVideoTime(video.currentTime);

      maybeShowShell();
    },
    [maybeShowShell],
  );
  /**
   * Slider behavior:
   * - seeks video to exact selected time
   * - does NOT navigate
   */
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !chapterNow) return;

    const nextTime = Number(e.target.value);

    const safeTime = Math.min(
      Math.max(nextTime, chapterNow.start),
      chapterNow.end - 0.05,
    );

    video.currentTime = safeTime;
    setVideoTime(safeTime);
  };

  if (!isValidSlug) {
    return <Navigate to="/" replace />;
  }

  if (!foundBook || !chapterNow) {
    return (
      <Fallback>
        <div>{t("ui.loadingBook")}</div>
        <div style={{ opacity: 0.7 }}>slug: {bookSlug}</div>
      </Fallback>
    );
  }

  return (
    <>
      <PageBackground src="/ui/bg5.jpg" overlay />

      <Wrap>
        <Stage id="Stage">
          <VideoFrame ref={frameRef} id="VIDEO FRAME">
            <GoldenShellIcon />
            <GoldenShellModal />

            {DISABLE_VIDEO ? (
              <Placeholder id="Placeholder">
                <CalmBackground id="CalmBackground" />
                <ComingSoonText id="ComingSoonText">
                  ✨ {t("ui.storyAnimationComingSoon")} ✨
                </ComingSoonText>
              </Placeholder>
            ) : (
              <>
                {!!foundBook.videoSrc && (
                  <Video
                    ref={videoRef}
                    src={foundBook.videoSrc}
                    preload="auto"
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onLoadedMetadata={(e) => {
                      setIsVideoReady(true);
                    }}
                    onTimeUpdate={handleTimeUpdate}
                  />
                )}
              </>
            )}

            <ControlsLayer id="ControlsLayer">
              <TopBar id="TopBar">
                <Meta />

                <IconButton
                  onClick={toggleFullscreen}
                  aria-label={
                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                  }
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? "⤢" : "⛶"}
                </IconButton>
              </TopBar>

              <CenterControls>
                <BigButton
                  type="button"
                  onClick={DISABLE_VIDEO ? undefined : togglePlayPause}
                  aria-label={
                    DISABLE_VIDEO
                      ? "Story video not available yet"
                      : isPlaying
                        ? "Pause story"
                        : "Play story"
                  }
                  title={
                    DISABLE_VIDEO ? "Coming soon" : isPlaying ? "Pause" : "Play"
                  }
                  disabled={DISABLE_VIDEO}
                >
                  {DISABLE_VIDEO ? "✨" : isPlaying ? "❚❚" : "▶"}
                </BigButton>
              </CenterControls>

              <BottomLeft>
                <CustomIconButton
                  src="/ui/comet-left.png"
                  ariaLabel="Previous page"
                  onClick={goPrev}
                  size={120}
                />
              </BottomLeft>

              <ProgressBar
                type="range"
                min={chapterNow.start}
                max={chapterNow.end}
                step={0.1}
                value={Math.min(
                  Math.max(videoTime, chapterNow.start),
                  chapterNow.end,
                )}
                onChange={handleProgressChange}
              />

              <BottomRight>
                <CustomIconButton
                  src="/ui/comet-right.png"
                  ariaLabel="Next page"
                  onClick={goNext}
                  size={100}
                />
              </BottomRight>
            </ControlsLayer>
          </VideoFrame>
        </Stage>
      </Wrap>

      <audio
        ref={correctSoundRef}
        src="/ui/golden-shell-correct.mp3"
        preload="auto"
      />
    </>
  );
}
/* ---------- styles ---------- */

const ProgressBar = styled.input`
  position: absolute;
  left: 140px;
  right: 140px;
  bottom: 28px;
  z-index: 30;

  pointer-events: auto;
  cursor: pointer;

  -webkit-appearance: none;
  appearance: none;
  height: 15px;
  border-radius: 999px;

  background: linear-gradient(
    90deg,
    rgba(255, 210, 120, 0.8),
    rgba(255, 170, 80, 0.6)
  );

  outline: none;

  /* Track */
  &::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
  }

  /* Thumb (the handle) */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;

    width: 18px;
    height: 18px;
    border-radius: 50%;

    background: radial-gradient(
      circle,
      rgba(255, 240, 200, 1),
      rgba(255, 190, 120, 0.9)
    );

    box-shadow:
      0 0 10px rgba(255, 200, 120, 0.8),
      0 0 20px rgba(255, 170, 80, 0.4);

    margin-top: -6px;
  }
`;

const Wrap = styled.div`
  width: min(60%, 1100px);
  margin: 80px auto 0;
`;

const Stage = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 80dvh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoFrame = styled.div`
  position: relative;
  width: min(950px, 92vw);
  aspect-ratio: 16 / 9;
  min-height: 400px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  background: #000;
  pointer-events: none;
  z-index: 21;

  &:hover .controlsLayer {
    opacity: 1;
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #000;
`;

const TopBar = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  pointer-events: none;
`;

const Meta = styled.div`
  color: white;
  pointer-events: none;
`;

const IconButton = styled.button`
  pointer-events: auto;
  width: 40px;
  height: 36px;
  border-radius: 10px;
  border: none;

  background: rgba(255, 255, 255, 0.14);
  color: white;
  backdrop-filter: blur(10px);
  cursor: pointer;

  display: grid;
  place-items: center;
  font-size: 1.125rem;
`;

const BigButton = styled.button`
  pointer-events: auto;

  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: none;

  background: rgba(255, 255, 255, 0.18);
  color: white;
  backdrop-filter: blur(10px);
  cursor: pointer;

  display: grid;
  place-items: center;
  ont-size: 1.75rem;
`;

const ControlsLayer = styled.div.attrs({ className: "controlsLayer" })`
  position: absolute;
  inset: 0;
  z-index: 20;

  opacity: 0;
  transition: opacity 0.25s ease;

  pointer-events: none; /* layer doesn't block video; buttons re-enable */
`;

const CenterControls = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 21;
`;

const BottomLeft = styled.div`
  position: absolute;
  bottom: -12px;
  left: 12px;
  pointer-events: none;
`;

const BottomRight = styled.div`
  position: absolute;
  bottom: -12px;
  right: 12px;
  pointer-events: none;
`;

const Fallback = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #000;
  color: white;
  font-size: 1rem;
`;

const Placeholder = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
`;

const CalmBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.12),
      transparent 45%
    ),
    radial-gradient(
      circle at 70% 60%,
      rgba(255, 255, 255, 0.1),
      transparent 45%
    ),
    linear-gradient(180deg, rgba(10, 14, 30, 0.9), rgba(5, 8, 18, 0.95));
`;

const ComingSoonText = styled.p`
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  z-index: 2;
  margin: 0;
  padding: 10px 14px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(0, 0, 0, 0.35);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
`;
