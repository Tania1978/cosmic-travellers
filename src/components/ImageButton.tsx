import styled from "styled-components";

interface BackButtonProps {
  $width?: string;
  $height?: string;
  $responsive?: boolean;
}

export const ImageButton = styled.button<BackButtonProps>`
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  font-size: 0;
  line-height: 0;

  img {
    ${({ $width, $height }) =>
      $width
        ? `width: ${$width}; height: auto;`
        : $height
          ? `height: ${$height}; width: auto;`
          : `height: 28px; width: auto;`}

    display: block;
  }

  /* 📱 Mobile scaling only when $responsive is true */
  ${({ $responsive, $width, $height }) =>
    $responsive &&
    `
    @media (max-width: 600px) {
      img {
        ${
          $width
            ? `width: calc(${$width} * 0.7);`
            : $height
              ? `height: calc(${$height} * 0.7);`
              : `height: 14px;`
        }
      }
    }
  `}
`;

