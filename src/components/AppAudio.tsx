import { useEffect, useRef } from "react";
import { useSound } from "../contexts/soundContext";
import guitarMp3 from "../assets/audio/harp.mp3";

let appAudioInstanceCount = 0;

export function AppAudio() {
  const instanceIdRef = useRef(++appAudioInstanceCount);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);
  const { volume, muted } = useSound();

  console.log("[AppAudio render]", {
    instanceId: instanceIdRef.current,
  });

  useEffect(() => {
    console.log("[AppAudio mounted]", {
      instanceId: instanceIdRef.current,
    });

    if (!audioRef.current) {
      const audio = new Audio(guitarMp3);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = volume * volume;
      audio.muted = muted;
      audioRef.current = audio;

      console.log("[audio created]", {
        instanceId: instanceIdRef.current,
      });
    }

    const startMusic = () => {
      const audio = audioRef.current;

      console.log("[startMusic fired]", {
        instanceId: instanceIdRef.current,
        hasStarted: hasStartedRef.current,
        paused: audio?.paused,
        currentTime: audio?.currentTime,
        ts: Date.now(),
      });

      console.trace("[startMusic trace]");

      if (!audio) return;
      if (hasStartedRef.current || !audio.paused) return;

      audio
        .play()
        .then(() => {
          hasStartedRef.current = true;
          console.log("[music started]", {
            instanceId: instanceIdRef.current,
          });
        })
        .catch((err) => {
          console.error("[music failed]", {
            instanceId: instanceIdRef.current,
            name: err?.name,
            message: err?.message,
          });
        });
    };

    document.addEventListener("click", startMusic, { once: true });
    document.addEventListener("touchstart", startMusic, { once: true });
    document.addEventListener("keydown", startMusic, { once: true });

    return () => {
      console.log("[AppAudio cleanup]", {
        instanceId: instanceIdRef.current,
      });

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

  return null;
}
