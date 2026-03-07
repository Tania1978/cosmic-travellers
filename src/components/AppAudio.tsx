import { useEffect, useRef } from "react";
import { useSound } from "../contexts/soundContext";
import guitarMp3 from "../assets/audio/guitar.mp3";

export function AppAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume, muted } = useSound();

  // create/play once
  useEffect(() => {
    const audio = new Audio(guitarMp3);
    audio.loop = true;
    audio.volume = volume;
    audio.muted = muted;

    audioRef.current = audio;

    const startMusic = async () => {
      try {
        await audio.play();
        console.log("Music started");
      } catch (err) {
        console.error("Music failed", err);
      }

      window.removeEventListener("pointerdown", startMusic);
    };

    window.addEventListener("pointerdown", startMusic);

    return () => {
      window.removeEventListener("pointerdown", startMusic);
      audio.pause();
    };
  }, []);

  // keep audio volume in sync with context
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  // keep audio muted in sync with context
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = muted;
  }, [muted]);

  return null;
}
