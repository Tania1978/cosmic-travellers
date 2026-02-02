// StoryMagicFxOverlay.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useGoldenShells } from "./GoldenShellsProvider";

/**
 * Super-obvious version: big bright ribbon + strong halo + lots of sparkles,
 * flies across the screen and “dives” into the satchel.
 *
 * Later you can dial it down by tweaking:
 * - RIBBON_WIDTH/HEIGHT
 * - core gradient opacities
 * - halo opacity
 * - blur
 */
export function StoryMagicFxOverlay() {
  const { fxPlayId, satchelEl } = useGoldenShells();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // We render “instances” with start/end positions, then remove them after animation.
  const [instances, setInstances] = useState<FxInstance[]>([]);

  useEffect(() => {
    if (!fxPlayId) return;
    const overlay = overlayRef.current;
    if (!overlay || !satchelEl) return;

    const overlayRect = overlay.getBoundingClientRect();
    const satchelRect = satchelEl.getBoundingClientRect();

    const endX = satchelRect.left + satchelRect.width / 2 - overlayRect.left;
    const endY = satchelRect.top + satchelRect.height / 2 - overlayRect.top;

    // Start from off-screen left; aim roughly toward satchel but not perfectly straight (more magical).
    const startX = -RIBBON_WIDTH * 0.6;
    const startY = clamp(endY - 120, 80, overlayRect.height - 80);

    const id = `${fxPlayId}-${Date.now()}`;

    setInstances((prev) => [
      ...prev,
      {
        id,
        startX,
        startY,
        endX,
        endY,
      },
    ]);

    // Cleanup after animation completes (keep in sync with DURATION)
    const t = window.setTimeout(() => {
      setInstances((prev) => prev.filter((x) => x.id !== id));
    }, DURATION_MS + 80);

    return () => window.clearTimeout(t);
  }, [fxPlayId, satchelEl]);

  return (
    <Overlay ref={overlayRef} aria-hidden="true">
      {instances.map((inst) => (
        <FxBurst
          key={inst.id}
          startX={inst.startX}
          startY={inst.startY}
          endX={inst.endX}
          endY={inst.endY}
        />
      ))}
    </Overlay>
  );
}

/* -----------------------------
   React subcomponent: one burst
-------------------------------- */
function FxBurst(props: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}) {
  const { startX, startY, endX, endY } = props;

  const dx = endX - startX;
  const dy = endY - startY;

  // Slight curvature: use “bend” by injecting a control-like offset in keyframes.
  const bendX = dx * 0.55;
  const bendY = dy * 0.22;

  // “Overshoot then dive”: near the end we go a little past the satchel, then shrink into it.
  const overshootX = dx * 1.04;
  const overshootY = dy * 1.04;

  const anim = useMemo(
    () => makeRibbonAnim(bendX, bendY, overshootX, overshootY, dx, dy),
    [bendX, bendY, overshootX, overshootY, dx, dy],
  );

  return (
    <>
      {/* Optional global flash to make it unmistakable */}
      <Flash />

      <Ribbon
        $anim={anim}
        style={{
          left: `${startX}px`,
          top: `${startY}px`,
        }}
      >
        <Tail />
      </Ribbon>
    </>
  );
}

/* -----------------------------
   Styled Components + Keyframes
-------------------------------- */

type FxInstance = {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

const DURATION_MS = 1400;

// SUPER OBVIOUS sizes (dial down later)
const RIBBON_WIDTH = 560;
const RIBBON_HEIGHT = 72;

const twinkle = keyframes`
  0%   { transform: translateY(1px); opacity: 0.55; }
  50%  { transform: translateY(-1px); opacity: 1; }
  100% { transform: translateY(1px); opacity: 0.55; }
`;

const flash = keyframes`
  0%   { opacity: 0; }
  20%  { opacity: 1; }
  100% { opacity: 0; }
`;

function makeRibbonAnim(
  bendX: number,
  bendY: number,
  overshootX: number,
  overshootY: number,
  dx: number,
  dy: number,
) {
  // We generate a unique keyframes per burst so it can target satchel precisely.
  return keyframes`
    0%   { transform: translate(0px, 0px) scale(1); opacity: 0; }
    18%  { opacity: 1; }
    28%  { transform: translate(${bendX}px, ${bendY}px) scale(1.04); opacity: 1; }
    90%  { transform: translate(${overshootX}px, ${overshootY}px) scale(0.55); opacity: 0.98; }
    100% { transform: translate(${dx}px, ${dy}px) scale(0.18); opacity: 0; }
  `;
}

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 80;
`;

const Flash = styled.div`
  position: absolute;
  inset: 0;
  mix-blend-mode: screen;
  background: radial-gradient(
    circle at 55% 45%,
    rgba(255, 230, 170, 0.34),
    rgba(255, 230, 170, 0) 65%
  );
  animation: ${flash} 360ms ease-out forwards;
  opacity: 0;
`;

const Ribbon = styled.div<{ $anim: ReturnType<typeof keyframes> }>`
  position: absolute;
  width: ${RIBBON_WIDTH}px;
  height: ${RIBBON_HEIGHT}px;
  border-radius: 999px;
  transform-origin: left center;
  mix-blend-mode: screen;

  /* Obvious: crisp enough to read */
  filter: blur(3px);
  opacity: 1;

  /* Bright core beam */
  background: linear-gradient(
    90deg,
    rgba(255, 220, 140, 0),
    rgba(255, 235, 190, 0.62),
    rgba(255, 255, 255, 0.92),
    rgba(255, 235, 190, 0.62),
    rgba(255, 220, 140, 0)
  );

  /* Big halo */
  &::before {
    content: "";
    position: absolute;
    inset: -44px -90px;
    border-radius: 999px;
    background: radial-gradient(
      closest-side at 45% 50%,
      rgba(255, 220, 140, 1),
      rgba(255, 220, 140, 0) 72%
    );
    opacity: 0.95;
    filter: blur(2px);
  }

  /* Extra highlight streak */
  &::after {
    content: "";
    position: absolute;
    inset: -18px -36px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.44),
      rgba(255, 255, 255, 0)
    );
    opacity: 0.95;
  }

  animation: ${({ $anim }) => $anim} ${DURATION_MS}ms
    cubic-bezier(0.22, 1, 0.36, 1) forwards;
`;

const Tail = styled.div`
  position: absolute;
  inset: 0;

  /* A lot of sparkles */
  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 999px;
    mix-blend-mode: screen;
    opacity: 1;

    background:
      radial-gradient(
        circle at 6% 45%,
        rgba(255, 255, 255, 0.95) 0 2px,
        transparent 5px
      ),
      radial-gradient(
        circle at 12% 62%,
        rgba(255, 255, 255, 0.85) 0 2px,
        transparent 5px
      ),
      radial-gradient(
        circle at 18% 40%,
        rgba(255, 255, 255, 0.92) 0 2px,
        transparent 5px
      ),
      radial-gradient(
        circle at 26% 58%,
        rgba(255, 255, 255, 0.82) 0 2px,
        transparent 5px
      ),
      radial-gradient(
        circle at 34% 44%,
        rgba(255, 255, 255, 0.95) 0 2px,
        transparent 5px
      ),
      radial-gradient(
        circle at 42% 63%,
        rgba(255, 255, 255, 0.82) 0 2px,
        transparent 5px
      ),
      radial-gradient(
        circle at 50% 42%,
        rgba(255, 255, 255, 0.92) 0 2px,
        transparent 5px
      ),
      radial-gradient(
        circle at 58% 60%,
        rgba(255, 255, 255, 0.85) 0 2px,
        transparent 5px
      ),
      radial-gradient(
        circle at 66% 45%,
        rgba(255, 255, 255, 0.92) 0 2px,
        transparent 5px
      ),
      radial-gradient(
        circle at 74% 62%,
        rgba(255, 255, 255, 0.82) 0 2px,
        transparent 5px
      ),
      radial-gradient(
        circle at 82% 44%,
        rgba(255, 255, 255, 0.95) 0 2px,
        transparent 5px
      ),
      radial-gradient(
        circle at 90% 58%,
        rgba(255, 255, 255, 0.85) 0 2px,
        transparent 5px
      );

    animation: ${twinkle} 420ms ease-in-out infinite;
  }

  /* Bloom layer for sparkles */
  &::after {
    filter: blur(1px);
    opacity: 0.75;
    animation-duration: 520ms;
  }
`;

/* -----------------------------
   Helpers
-------------------------------- */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
