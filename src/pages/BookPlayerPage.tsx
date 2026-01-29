// src/pages/BookPlayerPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { useChapterVideoPlayer } from "../hooks/useChapterVideoPlayer";
import { BOOKS } from "../data/books";
import { ArrowButton } from "../components/ArrowButton";
import PageBackground from "../components/PageBackground";

export default function BookPlayerPage() {
  const { bookSlug } = useParams();

  if (!bookSlug || !BOOKS[bookSlug]) return <Navigate to="/" replace />;

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
  });

  const frameRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const togglePlayPause = async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      if (v.paused) await v.play();
      else v.pause();
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
        <div>Loading book…</div>
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

            {/* Controls: visible ONLY on hover of the frame */}
            <ControlsLayer>
              <TopBar>
                <Meta></Meta>

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
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? "Pause story" : "Play story"}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? "❚❚" : "▶"}
                </BigButton>
              </CenterControls>

              <BottomLeft>
                <ArrowButton
                  src="/ui/comet-left.png"
                  ariaLabel="Previous page"
                  onClick={goPrev}
                  size={120}
                />
              </BottomLeft>

              <BottomRight>
                <ArrowButton
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

const Title = styled.div`
  font-size: 15px;
  opacity: 0.9;
`;

const PageInfo = styled.div`
  margin-top: 2px;
  font-size: 12px;
  opacity: 0.75;
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
  font-size: 18px;
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
  font-size: 28px;
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
  font-size: 16px;
`;
