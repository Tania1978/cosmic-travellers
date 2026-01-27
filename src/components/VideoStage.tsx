import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Stage = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 24px auto 0;
`;

const Frame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: black;
  border-radius: 16px;
  overflow: hidden;
`;

const VideoEl = styled.video<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transition: opacity 120ms ease;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
`;

const StartLayer = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.25);
  pointer-events: none;
`;

const StartButton = styled.button`
  pointer-events: auto;
  padding: 12px 18px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.55);
  color: white;
  cursor: pointer;
  font-size: 16px;
`;

const NavButton = styled.button`
  pointer-events: auto;
  position: absolute;
  top: 90%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.35);
  color: white;
  cursor: pointer;
`;

const PrevBtn = styled(NavButton)`
  left: 2%;
`;

const NextBtn = styled(NavButton)`
  right: 2%;
`;

type Props = {
  src: string;
  nextSrc: string | null;

  hasStarted: boolean;
  onStart: () => void;
  onEnded: () => void;

  showPrev: boolean;
  showNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

const waitOnce = (el: HTMLVideoElement, eventName: string) => {
  return new Promise<void>((resolve) => {
    const handler = () => {
      el.removeEventListener(eventName, handler);
      resolve();
    };
    el.addEventListener(eventName, handler);
  });
};

export function VideoStage(props: Props) {
  const { src, nextSrc, hasStarted, onStart, onEnded, showPrev, showNext, onPrev, onNext } = props;

  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);

  // true => A is visible/active; false => B is visible/active
  const [aActive, setAActive] = useState(true);

  const activeRef = aActive ? aRef : bRef;
  const bufferRef = aActive ? bRef : aRef;

  // Ensure the active video always has the current src
  useEffect(() => {
    const active = activeRef.current;

    if (!active) {
      return;
    }

    active.pause();
    active.currentTime = 0;

    // Assign current src directly (no <source> children)
    active.src = src;
    active.load();

    if (!hasStarted) {
      return;
    }

    const p = active.play();
    if (p) {
      p.catch(() => {});
    }
  }, [src, hasStarted, aActive]);

  // Preload nextSrc into the buffer (hidden) video
  useEffect(() => {
    const buffer = bufferRef.current;

    if (!buffer) {
      return;
    }

    buffer.pause();
    buffer.currentTime = 0;

    if (!nextSrc) {
      buffer.removeAttribute("src");
      buffer.load();
      return;
    }

    buffer.src = nextSrc;
    buffer.load();
  }, [nextSrc, aActive]);

  const handleStart = async () => {
    onStart();

    const active = activeRef.current;

    if (!active) {
      return;
    }

    try {
      await active.play();
    } catch {
      // user may need to tap again depending on browser
    }
  };

  const handleEndedInternal = async () => {
    if (!nextSrc) {
      onEnded();
      return;
    }

    const nextVideo = bufferRef.current;

    if (!nextVideo) {
      onEnded();
      return;
    }

    // Wait until first frame is available
    if (nextVideo.readyState < 2) {
      await waitOnce(nextVideo, "loadeddata");
    }

    // Start playback
    try {
      const p = nextVideo.play();
      if (p) {
        await p;
      }
    } catch {
      // proceed anyway; user can always recover with play
    }

    // Ensure it is actually playing (helps avoid a single black flash)
    if (nextVideo.readyState < 3) {
      await waitOnce(nextVideo, "playing");
    }

    // Swap visibility now that buffer is rendering frames
    setAActive((prev) => !prev);

    // Parent navigates to next page URL
    onEnded();
  };

  let startOverlay = null;
  if (!hasStarted) {
    startOverlay = (
      <StartLayer>
        <StartButton onClick={handleStart}>▶ Play</StartButton>
      </StartLayer>
    );
  }

  let prevButton = null;
  if (showPrev) {
    prevButton = (
      <PrevBtn onClick={onPrev} aria-label="Previous page">
        ‹
      </PrevBtn>
    );
  }

  let nextButton = null;
  if (showNext) {
    nextButton = (
      <NextBtn onClick={onNext} aria-label="Next page">
        ›
      </NextBtn>
    );
  }

  return (
    <Stage>
      <Frame>
        <VideoEl
          ref={aRef}
          $active={aActive}
          playsInline
          preload="auto"
          controls={false}
          loop={false}
          onEnded={aActive ? handleEndedInternal : undefined}
        />

        <VideoEl
          ref={bRef}
          $active={!aActive}
          playsInline
          preload="auto"
          controls={false}
          loop={false}
          onEnded={!aActive ? handleEndedInternal : undefined}
        />

        <Overlay>
          {startOverlay}
          {prevButton}
          {nextButton}
        </Overlay>
      </Frame>
    </Stage>
  );
}

