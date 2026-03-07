import { createContext, useContext, useState, type ReactNode } from "react";

type SoundContextType = {
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  muted: boolean;
  setMuted: React.Dispatch<React.SetStateAction<boolean>>;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [volume, setVolume] = useState(0.1);
  const [muted, setMuted] = useState(false);

  return (
    <SoundContext.Provider value={{ volume, setVolume, muted, setMuted }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);

  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }

  return context;
}
