import { useEffect, useRef } from "react";
import { useSound } from "../contexts/soundContext";
import guitarMp3 from "../assets/audio/harp.mp3";

export function AppAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);
  const { volume, muted } = useSound();

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(guitarMp3);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = volume * volume;
      audio.muted = muted;
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    if (!audio) return;

    const startMusic = () => {
      if (hasStartedRef.current) return;

      audio
        .play()
        .then(() => {
          hasStartedRef.current = true;
          console.log("Music started");
        })
        .catch((err) => {
          console.error("Music failed", err);
        });
    };

    document.addEventListener("click", startMusic, { once: true });
    document.addEventListener("touchstart", startMusic, { once: true });
    document.addEventListener("keydown", startMusic, { once: true });

    return () => {
      document.removeEventListener("click", startMusic);
      document.removeEventListener("touchstart", startMusic);
      document.removeEventListener("keydown", startMusic);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume * volume;
  }, [volume]);

  useEffect(() => {
    return () => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      hasStartedRef.current = false;
    };
  }, []);

  return null;
}
