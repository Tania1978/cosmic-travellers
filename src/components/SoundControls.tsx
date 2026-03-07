import { useState } from "react";
import styled from "styled-components";
import { useSound } from "../contexts/soundContext";


export function SoundControls() {
  const { volume, setVolume, muted, setMuted } = useSound();
  const [expanded, setExpanded] = useState(false);

  return (
    <Wrapper
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <ToggleButton
        type="button"
        onClick={() => setMuted(!muted)}
        aria-label={muted ? "Unmute sound" : "Mute sound"}
      >
        <img src={muted ? "/ui/volume-off.png" : "/ui/volume-on.png"} alt="" />
      </ToggleButton>

      <SliderWrapper $expanded={expanded}>
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={(e) => {
            const nextVolume = Number(e.target.value);
            setVolume(nextVolume);
            if (muted && nextVolume > 0) {
              setMuted(false);
            }
          }}
          aria-label="Volume"
        />
      </SliderWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: fixed;
  top: 80px;
  right: 30px;
  z-index: 30;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(19, 26, 56, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const ToggleButton = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: transparent;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 30px;
    height: 30px;
    pointer-events: none;
  }
  &:hover img {
    transform: scale(1.08);
    filter: drop-shadow(0 0 6px rgba(160, 120, 255, 0.6));
  }

  img {
    transition:
      transform 0.2s ease,
      filter 0.2s ease;
  }
`;

const SliderWrapper = styled.div<{ $expanded: boolean }>`
  width: ${({ $expanded }) => ($expanded ? "110px" : "0px")};
  opacity: ${({ $expanded }) => ($expanded ? 1 : 0)};
  overflow: hidden;
  transition:
    width 0.28s ease,
    opacity 0.2s ease;
`;

const VolumeSlider = styled.input`
  width: 110px;
  cursor: pointer;
  accent-color: #c918f6ff; /* your color */
`;

