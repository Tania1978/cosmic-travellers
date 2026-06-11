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
import { getVideoUrlForBooklet } from "../requests";
import { useAuth } from "../auth/authContext";
import { AccessRequiredScreen } from "../auth/AccessRequiredScreen";
import { useUserState } from "../contexts/userContext";
import { OtherVideo } from "../components/VideoLoader";

const CHAPTER_PREROLL_SECONDS = 0.5;

interface IBookPlayerPageProps {
  isPlaying: boolean | null;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function BookPlayerPage({
  isPlaying,
  setIsPlaying,
}: IBookPlayerPageProps) {
  const { bookSlug, page } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    isModalOpen,
    correctSoundRef,
    setActiveOpportunity,
    activeOpportunity,
    isShellEarned,
  } = useGoldenShells();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const wasPlayingRef = useRef(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [videoTime, setVideoTime] = useState(0);
  const [pendingManualPage, setPendingManualPage] = useState<number | null>(
    null,
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [signedVideoSrc, setSignedVideoSrc] = useState("");
  const [controlsVisible, setControlsVisible] = useState(false);
  const controlsTimerRef = useRef<number | null>(null);
  const { unlockedBooks } = useUserState();
  const { authUser, setAuthModalOpen } = useAuth();
  const isPreviewMode = true;
  const { setIsPreviewAccessModalOpen } = useUserState();

  const revealControls = () => {
    setControlsVisible(true);

    if (controlsTimerRef.current) {
      window.clearTimeout(controlsTimerRef.current);
    }

    controlsTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 2500);
  };

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

  /**
   * All remaining unearned shells for the current page.
   *
   * Example:
   * page has ["first-life", "origin-life"]
   * before answering: both are here
   * after answering first-life: only origin-life remains
   */
  const shellsForCurrentPage = useMemo(() => {
    return shellOpportunities.filter((shell) => {
      if (shell.page !== currentPage) return false;
      if (isShellEarned(shell.id)) return false;

      return true;
    });
  }, [shellOpportunities, currentPage, isShellEarned]);

  /**
   * Only one shell can be active/open at a time.
   * So we take the first remaining shell as the next one to show.
   */
  const nextShellForCurrentPage = shellsForCurrentPage[0] ?? null;

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

  const isAuthenticated = Boolean(authUser);
  const isFreeBooklet = bookSlug === "the-mission-begins";
  const isUnlocked = isFreeBooklet
    ? true
    : !isAuthenticated
      ? false
      : unlockedBooks[bookSlug ?? ""] === undefined
        ? null
        : Boolean(unlockedBooks[bookSlug ?? ""]);

  useEffect(() => {
    async function loadVideo() {
      setVideoLoading(true);
      if (!foundBook?.videoPath) return;

      const url = await getVideoUrlForBooklet(
        foundBook.slug,
        foundBook.videoPath,
      );

      setSignedVideoSrc(url);
      requestAnimationFrame(() => {
        videoRef.current?.play();
      });
    }

    loadVideo();
  }, [foundBook?.slug, foundBook?.videoPath, isUnlocked]);

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
   * Page/video sync:
   *
   * Manual navigation:
   * - next/prev buttons set pendingManualPage
   * - when URL reaches that page, video seeks to chapter start
   *
   * Playback sync:
   * - when video naturally progresses into another chapter,
   *   URL updates to match video.currentTime
   */
  useEffect(() => {
    if (!isVideoReady) return;
    if (!foundBook || !bookSlug || !chapterNow) return;

    const video = videoRef.current;
    if (!video) return;

    if (pendingManualPage === currentPage) {
      const startTime = Math.max(0, chapterNow.start - CHAPTER_PREROLL_SECONDS);

      video.currentTime = startTime;
      setVideoTime(startTime);
      setPendingManualPage(null);

      return;
    }

    if (pendingManualPage !== null) return;

    const actualVideoTime = video.currentTime;

    const actualTimeBelongsToCurrentUrlPage =
      actualVideoTime >= chapterNow.start - CHAPTER_PREROLL_SECONDS &&
      actualVideoTime < chapterNow.end;

    if (actualTimeBelongsToCurrentUrlPage) return;

    const chapterForVideoTime = foundBook.chapters.find(
      (chapter) =>
        actualVideoTime >= chapter.start && actualVideoTime < chapter.end,
    );

    if (!chapterForVideoTime) return;
    if (chapterForVideoTime.page === currentPage) return;

    // Direct URL / refresh case:
    // URL says page 10, but video is still at 0 before we seeked it.
    if (actualVideoTime === 0 && currentPage > 1) {
      const startTime = Math.max(0, chapterNow.start - CHAPTER_PREROLL_SECONDS);

      video.currentTime = startTime;
      setVideoTime(startTime);

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
      // iPhone Safari native video fullscreen
      if (video && (video as any).webkitEnterFullscreen) {
        (video as any).webkitEnterFullscreen();
        return;
      }

      const orientation = (screen as any)?.orientation;

      if (!document.fullscreenElement) {
        await frame?.requestFullscreen?.();

        try {
          await orientation?.lock?.("landscape");
        } catch {}
      } else {
        await document.exitFullscreen();

        try {
          await orientation?.unlock?.();
        } catch {}
      }
    } catch (error: any) {
      console.log(`Fullscreen error: ${error?.message || error}`);
    }
  };
  /**
   * Shows the next remaining shell for the current page.
   *
   * Important:
   * - `shellsForCurrentPage` can contain many shells
   * - `nextShellForCurrentPage` is the one we show now
   * - after it is earned, this recalculates and points to the next one
   */
  const maybeShowShell = useCallback(() => {
    const video = videoRef.current;

    if (!video) return;
    if (!chapterNow) return;
    if (isModalOpen) return;
    if (!nextShellForCurrentPage) return;

    if (activeOpportunity?.id === nextShellForCurrentPage.id) return;

    const shellMoment = chapterNow.end - 1;

    if (video.currentTime >= shellMoment) {
      setActiveOpportunity(nextShellForCurrentPage);
    }
  }, [
    chapterNow,
    isModalOpen,
    nextShellForCurrentPage,
    activeOpportunity?.id,
    setActiveOpportunity,
  ]);

  /**
   * Shell re-check:
   * - needed when multiple shells are on the same page
   * - after one shell is earned, nextShellForCurrentPage changes
   * - video time may not change immediately, so onTimeUpdate may not fire
   */
  useEffect(() => {
    if (isModalOpen) return;

    maybeShowShell();
  }, [isModalOpen, nextShellForCurrentPage, maybeShowShell, chapterNow]);

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
   * - seeks video inside current chapter only
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

  const startStripeCheckout = () => {
    alert("Payment Flow to be added");
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
        <Stage id="Stage" isPlaying={isPlaying}>
          <VideoFrame
            $controlsVisible={controlsVisible}
            onClick={revealControls}
            onTouchStart={revealControls}
            ref={frameRef}
          >
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
                {isAuthenticated && isUnlocked === false && (
                  <AccessRequiredScreen
                    src="/ui/unlock-adventure.mp4"
                    title="This Adventure Is Waiting"
                    message="Unlock this booklet to continue your journey."
                    buttonLabel="Unlock Adventure"
                    onAction={() => {
                      if (isPreviewMode) {
                        setIsPreviewAccessModalOpen(true);
                      } else {
                        startStripeCheckout();
                      }
                    }}
                  />
                )}
                {!isAuthenticated && !isFreeBooklet && (
                  <AccessRequiredScreen
                    src="/ui/continue-journey.mp4"
                    title="Continue Your Adventure"
                    message="Sign in to continue exploring with the Cosmic Travellers."
                    buttonLabel="Continue Journey"
                    onAction={() => setAuthModalOpen(true)}
                  />
                )}
                {videoLoading && <OtherVideo src="/ui/magic-loader.mp4" />}
                {(isFreeBooklet || (isAuthenticated && isUnlocked)) &&
                  !!signedVideoSrc && (
                    <Video
                      ref={videoRef}
                      src={signedVideoSrc}
                      preload="auto"
                      playsInline
                      onLoadStart={() => {
                        setVideoLoading(true);
                      }}
                      onLoadedMetadata={() => {
                        setIsVideoReady(true);
                      }}
                      onLoadedData={() => {
                        setVideoLoading(false);
                      }}
                      onCanPlay={() => {
                        setVideoLoading(false);
                      }}
                      onPlaying={() => {
                        setVideoLoading(false);
                      }}
                      onWaiting={() => setVideoLoading(true)}
                      onSeeking={() => setVideoLoading(true)}
                      onSeeked={() => setVideoLoading(false)}
                      onError={() => setVideoLoading(false)}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
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
  width: 100%;
  margin: 0 auto;
  z-index: 10;
`;

const Stage = styled.div<{ isPlaying: boolean | null }>`
  width: 100%;
  display: flex;
  justify-content: center;

  margin-top: 100px;

  @media (max-width: 600px) {
    margin-top: 100px;
  }
`;

const Video = styled.video`
  position: absolute;
  inset: 0;
  z-index: 0;

  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
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
  font-size: 1.75rem;
`;

const VideoFrame = styled.div<{ $controlsVisible?: boolean }>`
  position: relative;
  width: 100%;
  max-width: 950px;

  aspect-ratio: 16 / 9;
  height: auto;
  min-height: 220px;

  background: transparent;
  overflow: hidden;
  z-index: 2;

  border-radius: 0;
  box-shadow: none;

  .controlsLayer {
    opacity: ${({ $controlsVisible }) => ($controlsVisible ? 1 : 0)};
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover .controlsLayer {
      opacity: 1;
    }
  }

  @supports not (aspect-ratio: 16 / 9) {
    height: 56.25vw;
    max-height: 534px;
  }

  @media (min-width: 768px) {
    width: min(950px, 92vw);
    height: min(52vw, 534px);
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  }
`;

const ControlsLayer = styled.div.attrs({
  className: "controlsLayer",
})`
  position: absolute;
  inset: 0;
  z-index: 20;

  opacity: 0;
  transition: opacity 0.25s ease;

  pointer-events: none;
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
  bottom: 18px;
  left: 12px;
  pointer-events: none;

  @media (max-width: 768px) {
    bottom: 12px;
  }
`;

const BottomRight = styled.div`
  position: absolute;
  bottom: 18px;
  right: 12px;
  pointer-events: none;

  @media (max-width: 768px) {
    bottom: 12px;
  }
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
