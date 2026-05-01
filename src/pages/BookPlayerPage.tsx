import { useEffect, useMemo, useRef, useState } from "react";
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

export default function BookPlayerPage() {
  const { bookSlug, page } = useParams();
  const { t } = useTranslation();
  const { isModalOpen, correctSoundRef } = useGoldenShells();
  const navigate = useNavigate();
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const foundBook = useMemo(
    () => BOOKSPAGES.find((b) => b.slug === bookSlug),
    [bookSlug],
  );
  if (!foundBook) {
    return;
  }

  const currentPage = Number(page);

  // 2️⃣ Find current chapter
  const chapterNow = useMemo(
    () => foundBook?.chapters.find((c) => c.page === currentPage),
    [foundBook, currentPage],
  );

  const nextChapter = useMemo(() => {
    if (!foundBook || !chapterNow) return undefined;
    const index = foundBook.chapters.findIndex((c) => c.page === currentPage);
    return foundBook.chapters[index + 1];
  }, [foundBook, chapterNow, currentPage]);

  const goToChapter = (targetPage: number) => {
    navigate(`/${bookSlug}/${targetPage}`);
  };

  const goNext = () => {
    if (!nextChapter) return;
    goToChapter(nextChapter.page);
  };

  const goPrev = () => {
    const index = foundBook.chapters.findIndex((c) => c.page === currentPage);
    const prev = foundBook.chapters[index - 1];
    if (!prev) return;
    goToChapter(prev.page);
  };

  const shellOpportunities = useMemo(() => {
    if (!foundBook?.requiredShellIds?.length) return [];

    return ALL_SHELL_OPPORTUNITIES.filter((shell: any) =>
      foundBook.requiredShellIds?.includes(shell.id),
    );
  }, [foundBook]);

  const wasPlayingRef = useRef(false);

  async function fadeTo(video: HTMLVideoElement, target: number, ms = 250) {
    const start = video.volume;
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      video.volume = start + (target - start) * (i / steps);
      await new Promise((r) => setTimeout(r, ms / steps));
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    (async () => {
      if (isModalOpen) {
        wasPlayingRef.current = !video.paused && !video.ended;
        if (wasPlayingRef.current) {
          await fadeTo(video, 0.15, 250);
          if (!cancelled) video.pause();
        } else {
          video.pause();
        }
      } else {
        if (wasPlayingRef.current) {
          await video.play().catch(() => {});
          if (!cancelled) await fadeTo(video, 1.0, 250);
        }
        wasPlayingRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isModalOpen]);

  const isValidSlug = useMemo(() => {
    return !!bookSlug && !!BOOK_CONFIGS[bookSlug];
  }, [bookSlug]);

  if (!isValidSlug) return <Navigate to="/" replace />;

  const frameRef = useRef<HTMLDivElement | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const { setActiveOpportunity, isShellEarned, store } = useGoldenShells();

  useEffect(() => {
    console.log("USE EFFECT IN BOOKPLAYER PAGE", isModalOpen);
    if (isModalOpen) return;
    const nextOpportunity =
      shellOpportunities.find((shell) => {
        if (shell.page !== currentPage) return false;
        if (isShellEarned(shell.id)) return false;
        return true;
      }) ?? null;
    console.log("nextOpportunity", nextOpportunity);
    console.log("currentChapter", chapterNow);

    setActiveOpportunity(null);

    if (!nextOpportunity || !chapterNow) return;

    const video = videoRef.current;
    if (!video) return;

    const delayMs = Math.max(
      0,
      (chapterNow?.end - video.currentTime - 1) * 1000,
    );

    const timeoutId = window.setTimeout(() => {
      setActiveOpportunity(nextOpportunity);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    currentPage,
    chapterNow,
    shellOpportunities,
    isShellEarned,
    setActiveOpportunity,
    store,
  ]);

  // Keep fullscreen state in sync (and clean up listeners).
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // If video is disabled, ensure play state doesn't get stuck "true".
  useEffect(() => {
    if (DISABLE_VIDEO) setIsPlaying(false);
  }, []);

  const togglePlayPause = async () => {
    if (DISABLE_VIDEO) return;

    const v = videoRef.current;
    if (!v) return;

    try {
      if (v.paused) {
        await v.play();
      } else {
        v.pause();
      }
    } catch (e) {
      console.log("play/pause error", e);
    }
  };

  const toggleFullscreen = async () => {
    const frame = frameRef.current;
    const video = videoRef.current;
    try {
      // iPad Safari video fullscreen
      if (video && (video as any).webkitEnterFullscreen) {
        (video as any).webkitEnterFullscreen();
        return;
      }

      // Standard Fullscreen API
      if (!document.fullscreenElement) {
        if (frame?.requestFullscreen) {
          await frame.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (e: any) {
      console.log(`Fullscreen error: ${e?.message || e}`);
    }
  };

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
            {/* <ShellSatchel /> */}
            <GoldenShellIcon />
            <GoldenShellModal />
            {/* Media area: either video, or a calm placeholder (no MP4 mode) */}
            {DISABLE_VIDEO ? (
              <Placeholder id="Placeholder">
                <CalmBackground id="CalmBackground" />
                <ComingSoonText id="ComingSoonText">
                  ✨ {t("ui.storyAnimationComingSoon")} ✨
                </ComingSoonText>
              </Placeholder>
            ) : (
              <>
                {!!foundBook?.videoSrc && (
                  <Video
                    ref={videoRef}
                    src={foundBook.videoSrc}
                    preload="auto"
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onLoadedMetadata={(e) => {
                      const video = e.currentTarget;
                      setVideoDuration(video.duration);

                      if (chapterNow) {
                        video.currentTime = chapterNow.start;
                      }
                    }}
                    onTimeUpdate={(e) => {
                      const video = e.currentTarget;
                      setVideoTime(video.currentTime);

                      if (!chapterNow) return;

                      const shellMoment = chapterNow.end - 1;

                      if (video.currentTime >= shellMoment && !isModalOpen) {
                        const nextOpportunity =
                          shellOpportunities.find((shell) => {
                            if (shell.page !== currentPage) return false;
                            if (isShellEarned(shell.id)) return false;
                            return true;
                          }) ?? null;

                        setActiveOpportunity(nextOpportunity);
                      }

                      if (video.currentTime >= chapterNow.end) {
                        video.pause();

                        if (nextChapter) {
                          navigate(`/${bookSlug}/${nextChapter.page}`, {
                            replace: true,
                          });
                        }
                      }
                    }}
                  />
                )}
              </>
            )}

            {/* Controls: visible ONLY on hover of the frame */}
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
                min={0}
                max={videoDuration || 0}
                step={0.1}
                value={videoTime}
                onChange={(e) => {
                  const nextTime = Number(e.target.value);
                  setVideoTime(nextTime);

                  if (videoRef.current) {
                    videoRef.current.currentTime = nextTime;
                  }
                }}
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

// const Title = styled.div`
//   font-size: 15px;
//   opacity: 0.9;
// `;

// const PageInfo = styled.div`
//   margin-top: 2px;
//   font-size: 0.75rem;
//   opacity: 0.75;
// `;

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

// const BigButton = styled.button`
//   pointer-events: auto;
// `;

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

// /** Placeholder fills the same exact space as the video */
// const Placeholder = styled.div`
//   width: 100%;
//   height: 100%;
//   position: relative;
// `;

// /** Replace this with your calm still (or gentle gradient / stars) */
// const CalmBackground = styled.div`
//   position: absolute;
//   inset: 0;

//   /* Example gentle background */
//   background:
//     radial-gradient(
//       circle at 30% 30%,
//       rgba(255, 255, 255, 0.12),
//       rgba(255, 255, 255, 0) 45%
//     ),
//     radial-gradient(
//       circle at 70% 60%,
//       rgba(255, 255, 255, 0.1),
//       rgba(255, 255, 255, 0) 45%
//     ),
//     linear-gradient(180deg, rgba(10, 14, 30, 0.9), rgba(5, 8, 18, 0.95));
// `;

// const ComingSoonText = styled.p`
//   position: absolute;
//   left: 50%;
//   bottom: 18px;
//   transform: translateX(-50%);
//   margin: 0;
//   padding: 10px 14px;
//   border-radius: 999px;
//   font-size: 0.875rem;
//   letter-spacing: 0.2px;
//   color: rgba(255, 255, 255, 0.92);
//   background: rgba(0, 0, 0, 0.35);
//   backdrop-filter: blur(6px);
// `;

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
