import styled, { css } from "styled-components";

type GlowTextVariant = "sm" | "md" | "lg";

interface GlowTextProps {
  src?: string; // texture image
  variant?: GlowTextVariant;
  width?: string;
}

interface GlowTextProps {
  variant?: "sm" | "md" | "lg";
  width?: string;
  src?: string;
  color?: string;
}

export const GlowText = styled.p.withConfig({
  shouldForwardProp: (prop) =>
    !["src", "variant", "width", "color"].includes(prop),
})<GlowTextProps>`
  font-weight: 700;
  font-family: "Fredoka", sans-serif;

  line-height: 1.12;
  letter-spacing: 0.4px;
  text-align: center;
  margin: 0;

  ${({ width }) =>
    width &&
    css`
      max-width: ${width};
      margin-left: auto;
      margin-right: auto;
    `}

  /* ✨ Size variants */
  ${({ variant }) =>
    variant === "sm" &&
    css`
      font-size: 14px;
      @media (min-width: 900px) {
        font-size: 20px;
      }
    `}

  ${({ variant }) =>
    variant === "md" &&
    css`
      font-size: 24px;
      @media (min-width: 650px) {
        font-size: 20px;
      }
      @media (min-width: 900px) {
        font-size: 24px;
      }
    `}

  ${({ variant }) =>
    variant === "lg" &&
    css`
      font-size: 24px;
      @media (min-width: 700px) {
        font-size: 28px;
      }
      @media (min-width: 900px) {
        font-size: 30px;
      }
    `}

  /* 🎨 Texture OR Color logic */
  ${({ src, color }) =>
    src
      ? css`
          background-image: url(${src});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        `
      : css`
          color: ${color || "#FFD580"};
        `}

  /* ✨ OUTER DEPTH */
  filter: drop-shadow(0 6px 14px rgba(121, 71, 9, 0.35))
    drop-shadow(0 20px 60px rgba(0, 0, 0, 0.6));
`;
