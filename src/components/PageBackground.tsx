import styled from "styled-components";

type PageBackgroundProps = {
  src: string;
  overlay?: boolean; // optional soft overlay for readability
};

export default function PageBackground({
  src,
  overlay = false,
}: PageBackgroundProps) {
  return (
    <>
      <Bg $src={src} />
      {overlay && <Overlay />}
    </>
  );
}

/* ---------- styled components ---------- */

const Bg = styled.div<{ $src: string }>`
  position: fixed;
  inset: 0;
  z-index: -2;

  background-image: url(${({ $src }) => $src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;

  /* soft atmospheric light layer */
  background:
    radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.35),
      transparent 60%
    ),
    radial-gradient(
      circle at 70% 70%,
      rgba(255, 255, 255, 0.25),
      transparent 65%
    );
`;
