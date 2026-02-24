import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { DISABLE_VIDEO } from "../config/features";
import { useChapterVideoPlayer } from "../hooks/useChapterVideoPlayer";
import { BOOKS } from "../data/books";
import { CustomIconButton } from "../components/CustomIconButton";
import PageBackground from "../components/PageBackground";
import { useTranslation } from "react-i18next";
import { useGoldenShells } from "../GoldenShells/GoldenShellsProvider";
import { ShellOpportunityBinder } from "../GoldenShells/utils";
import { GoldenShellOverlay } from "../GoldenShells/GoldenShellOverlay";

export default function BookPlayerPage() {
  const { bookSlug, page } = useParams();
  const { t } = useTranslation();
  const { earnedThisSession, isModalOpen } = useGoldenShells();

  const wasPlayingRef = useRef(false);

  const {
    book,
    videoRef,
    currentChapter,
    onTimeUpdate,
    onLoadedMetadata,
    goNext,
    goPrev,
  } = useChapterVideoPlayer({
    pauseAtChapterEnd: false,
    earnedThisSession,
  });

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
    return !!bookSlug && !!BOOKS[bookSlug];
  }, [bookSlug]);

  if (!isValidSlug) return <Navigate to="/" replace />;

  const frameRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    const el = frameRef.current;
    if (!el) return;

    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.log("fullscreen error", e);
    }
  };

  if (!book || !currentChapter) {
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
        <Stage>
          <VideoFrame ref={frameRef}>
            {/* ✅ Shell opportunity binding for current page */}
            <ShellOpportunityBinder
              page={Number(page)}
              videoRef={videoRef}
              chapterEnd={currentChapter.end}
            />

            {/* Media area: either video, or a calm placeholder (no MP4 mode) */}
            {DISABLE_VIDEO ? (
              <Placeholder>
                <CalmBackground />
                <ComingSoonText>
                  ✨ {t("ui.storyAnimationComingSoon")} ✨
                </ComingSoonText>
              </Placeholder>
            ) : (
              <Video
                ref={videoRef}
                src={book.videoSrc}
                preload="auto"
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={onTimeUpdate}
              />
            )}

            {/* Controls: visible ONLY on hover of the frame */}
            <ControlsLayer>
              <TopBar>
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

              <BottomRight>
                <CustomIconButton
                  src="/ui/comet-right.png"
                  ariaLabel="Next page"
                  onClick={goNext}
                  size={100}
                />
              </BottomRight>
            </ControlsLayer>

            {/* ✅ Golden Shell UI + Satchel + Story FX overlays */}
            <GoldenShellOverlay />
          </VideoFrame>
        </Stage>
      </Wrap>
    </>
  );
}

/* ---------- styles ---------- */

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 35px;
`;

const Stage = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoFrame = styled.div`
  position: relative;

  width: 950px;
  max-width: 90vw;
  aspect-ratio: 16 / 9;

  border-radius: 14px;
  overflow: hidden;

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  background: #000;

  /* Hover controls */
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

const ControlsLayer = styled.div.attrs({ className: "controlsLayer" })`
  position: absolute;
  inset: 0;
  z-index: 10;

  opacity: 0;
  transition: opacity 0.25s ease;

  pointer-events: none; /* layer doesn't block video; buttons re-enable */
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

const CenterControls = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
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

const BottomLeft = styled.div`
  position: absolute;
  bottom: 1px;
  left: 12px;
  pointer-events: none;
`;

const BottomRight = styled.div`
  position: absolute;
  bottom: 1px;
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

/** Placeholder fills the same exact space as the video */
const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

/** Replace this with your calm still (or gentle gradient / stars) */
const CalmBackground = styled.div`
  position: absolute;
  inset: 0;

  /* Example gentle background */
  background:
    radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0) 45%
    ),
    radial-gradient(
      circle at 70% 60%,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0) 45%
    ),
    linear-gradient(180deg, rgba(10, 14, 30, 0.9), rgba(5, 8, 18, 0.95));
`;

const ComingSoonText = styled.p`
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  margin: 0;
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 0.875rem;
  letter-spacing: 0.2px;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
`;
