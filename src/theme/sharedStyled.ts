import styled from "styled-components";

interface TriggerProps {
  width?: string;
  minimal?: boolean;
}

export const Trigger = styled.button<TriggerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: ${({ width = "100%" }) => width};

  padding: ${({ minimal }) => (minimal ? "0" : "8px 14px")};

  border-radius: ${({ minimal }) => (minimal ? "0" : "999px")};

  border: ${({ minimal }) =>
    minimal ? "none" : "1px solid rgba(255, 255, 255, 0.35)"};

  background: ${({ minimal }) =>
    minimal ? "transparent" : "rgba(255, 255, 255, 0.12)"};

  backdrop-filter: ${({ minimal }) => (minimal ? "none" : "blur(12px)")};

  cursor: pointer;

  color: white;
  font-weight: 600;

  box-shadow: ${({ minimal }) =>
    minimal
      ? "none"
      : `
        0 8px 24px rgba(0, 0, 0, 0.18),
        0 0 14px rgba(120, 180, 255, 0.18)
      `};

  transition:
    transform 200ms ease,
    filter 200ms ease;

  &:hover {
    transform: ${({ minimal }) => (minimal ? "none" : "translateY(-1px)")};
    filter: brightness(1.08);
  }
`;
