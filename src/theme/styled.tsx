import styled from "styled-components";

interface BackButtonProps {
  $width?: string;
  $height?: string;
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
`;
