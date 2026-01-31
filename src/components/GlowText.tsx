import styled, { css } from "styled-components";

type GlowTextVariant = "sm" | "md" | "lg";

interface GlowTextProps {
  src?: string; // texture image
  variant?: GlowTextVariant;
  width?: string;
}

export const GlowText = styled.p.withConfig({
  shouldForwardProp: (prop) => !["src", "variant", "width"].includes(prop),
})<GlowTextProps>`
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: 0.4px;
  text-align: center;
  margin: 0;
  font-style: italic;

  ${({ width }) =>
    width &&
    css`
      max-width: ${width};
      margin-left: auto;
      margin-right: auto;
    `}

  /* ✨ Size variants */
  ${({ variant = "sm" }) =>
    variant === "sm" &&
    css`
      font-size: 1.125rem;
      font-style: italic;
      @media (min-width: 650px) {
        font-size: 1.5rem;
      }
      @media (min-width: 900px) {
        font-size: 1.25rem;
        font-style: italic;
      }
    `}

  ${({ variant = "md" }) =>
    variant === "md" &&
    css`
      font-size: 1.25rem;
      @media (min-width: 650px) {
        font-size: 2.125rem;
      }
      @media (min-width: 900px) {
        font-size: 1.75rem;
      }
    `}

  ${({ variant }) =>
    variant === "lg" &&
    css`
      font-size: 2rem;
      @media (min-width: 650px) {
        font-size: 2.75rem;
      }
      @media (min-width: 900px) {
        font-size: 2.125rem;
      }
    `}

  /* 🌈 Glow texture fill */
  background-image: url(${({ src }) => src || "/ui/title-glow-2.jpg"});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  /* ✨ OUTER DEPTH */
  filter: drop-shadow(0 6px 14px rgba(121, 71, 9, 0.35))
    drop-shadow(0 20px 60px rgba(0, 0, 0, 0.6));
`;
