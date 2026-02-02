import { useEffect, useRef, useState } from "react";
import { useGoldenShells } from "./GoldenShellsProvider";
import styled from "styled-components";

export const MagicOverlayVideo = styled.video<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  pointer-events: none;
  z-index: 90;

  /* the “black disappears, light stays” trick */
  mix-blend-mode: screen;

  opacity: ${({ $visible }) => ($visible ? 0.9 : 0)};
  transition: opacity 800ms ease-in-out;
`;

const DURATION_MS = 3000; // match your mp4 length

export function StoryMagicFxOverlay() {
  const { fxPlayId } = useGoldenShells();
  const [visible, setVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!fxPlayId) return;

    // Restart the clip from the beginning every time
    const v = videoRef.current;
    if (v) {
      try {
        v.currentTime = 0;
      } catch {}
      v.play().catch(() => {});
    }

    setVisible(true);

    // Fade out near the end
    const t = window.setTimeout(() => setVisible(false), DURATION_MS - 600);

    return () => window.clearTimeout(t);
  }, [fxPlayId]);

  return (
    <MagicOverlayVideo
      ref={videoRef}
      src="/ui/magic-shell-light.mp4"
      muted
      playsInline
      preload="auto"
      $visible={visible}
      onEnded={() => setVisible(false)}
    />
  );
}
