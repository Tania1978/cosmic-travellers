import styled from "styled-components";

export const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  cursor: pointer;

  color: white;
  font-weight: 600;

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.18),
    0 0 14px rgba(120, 180, 255, 0.18);

  transition:
    transform 200ms ease,
    filter 200ms ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.08);
  }
`;
