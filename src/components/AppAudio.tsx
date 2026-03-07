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

    audio.play().catch((error) => {
      console.log("Autoplay blocked:", error);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
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
