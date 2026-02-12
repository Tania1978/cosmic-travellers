import styled from "styled-components";

type ArrowButtonProps = {
  src: string;
  onClick?: () => void;
  ariaLabel: string;
  size?: number; // optional, default 64
};

export function CustomIconButton({
  src,
  onClick,
  ariaLabel,
  size = 64,
}: ArrowButtonProps) {
  return (
    <Button onClick={onClick} aria-label={ariaLabel} $size={size}>
      <Img src={src} alt="" draggable={false} />
    </Button>
  );
}

/* styled-components */

const Button = styled.button<{ $size: number }>`
  pointer-events: auto;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;

  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    transform 0.2s ease,
    filter 0.2s ease,
    opacity 0.2s ease;

  opacity: 0.85;

  &:hover {
    transform: scale(1.08);
    opacity: 1;
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.6));
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
`;
