import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { GoldenShellsStore, ShellOpportunity } from "./types";
import { loadShellsStore, saveShellsStore } from "./storage";

type GoldenShellsContextValue = {
  bookletId: string;
  store: GoldenShellsStore;
  totalEarned: number;
  earnedThisSession: number;
  activeOpportunity: ShellOpportunity | null;
  isModalOpen: boolean;
  isShellEarned: (shellId: string) => boolean;
  setActiveOpportunity: (opportunity: ShellOpportunity | null) => void;
  openModal: () => void;
  closeModal: () => void;
  submitAnswer: (choiceId: string) => {
    correct: boolean;
    completedBooklet: boolean;
  };
  hasEarnedAllBookletShells: boolean;
  shellCompletionVideoSrc?: string;
  correctSoundRef: RefObject<HTMLAudioElement | null>;
};

const GoldenShellsContext = createContext<GoldenShellsContextValue | null>(
  null,
);

type GoldenShellsProviderProps = {
  bookletId: string;
  children: ReactNode;
  requiredShellIds: string[];
  shellCompletionVideoSrc?: string;
};

export function GoldenShellsProvider({
  bookletId,
  children,
  requiredShellIds,
  shellCompletionVideoSrc,
}: GoldenShellsProviderProps) {
  const [store, setStore] = useState<GoldenShellsStore>(() =>
    loadShellsStore(),
  );
  const [activeOpportunity, setActiveOpportunity] =
    useState<ShellOpportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    saveShellsStore(store);
  }, [store]);

  const totalEarned = store.totalEarned;
  const earnedThisSession = store.sessionEarnedByBooklet[bookletId] ?? 0;

  const isShellEarned = (shellId: string) => {
    return store.byBooklet[bookletId]?.[shellId] ?? false;
  };

  const playCorrectSound = () => {
    const sound = correctSoundRef.current;
    if (!sound) return;

    sound.currentTime = 0;
    sound.volume = 0.45;
    sound.play().catch(() => {});
  };

  const openModal = () => {
    if (
      !activeOpportunity &&
      !(hasEarnedAllBookletShells && shellCompletionVideoSrc)
    ) {
      return;
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const submitAnswer = (choiceId: string) => {
    if (!activeOpportunity) {
      return { correct: false, completedBooklet: false };
    }

    const isCorrect = choiceId === activeOpportunity.correctChoiceId;
    if (isCorrect) {
      playCorrectSound();
    }

    if (!isCorrect) {
      return { correct: false, completedBooklet: false };
    }

    // 👇 compute BEFORE updating store
    const completedBooklet =
      requiredShellIds.length > 0 &&
      requiredShellIds.every((id) => {
        if (id === activeOpportunity.id) return true;
        return store.byBooklet[bookletId]?.[id] ?? false;
      });

    setStore((prev) => {
      const alreadyEarned = prev.byBooklet[bookletId]?.[activeOpportunity.id];

      if (alreadyEarned) {
        return prev;
      }

      return {
        ...prev,
        byBooklet: {
          ...prev.byBooklet,
          [bookletId]: {
            ...prev.byBooklet[bookletId],
            [activeOpportunity.id]: true,
          },
        },
        totalEarned: prev.totalEarned + 1,
        sessionEarnedByBooklet: {
          ...prev.sessionEarnedByBooklet,
          [bookletId]: (prev.sessionEarnedByBooklet[bookletId] ?? 0) + 1,
        },
      };
    });

    return { correct: true, completedBooklet };
  };

  const hasEarnedAllBookletShells =
    requiredShellIds.length > 0 &&
    requiredShellIds.every((id) => isShellEarned(id));

  const value = useMemo(
    () => ({
      bookletId,
      store,
      totalEarned,
      earnedThisSession,
      activeOpportunity,
      isModalOpen,
      isShellEarned,
      setActiveOpportunity,
      openModal,
      closeModal,
      submitAnswer,
      hasEarnedAllBookletShells,
      shellCompletionVideoSrc,
      correctSoundRef,
    }),
    [
      bookletId,
      store,
      totalEarned,
      earnedThisSession,
      activeOpportunity,
      isModalOpen,
      shellCompletionVideoSrc,
      correctSoundRef,
    ],
  );

  return (
    <GoldenShellsContext.Provider value={value}>
      {children}
    </GoldenShellsContext.Provider>
  );
}

export function useGoldenShells() {
  const context = useContext(GoldenShellsContext);

  if (!context) {
    throw new Error(
      "useGoldenShells must be used within a GoldenShellsProvider",
    );
  }

  return context;
}

export function useOptionalGoldenShells() {
  return useContext(GoldenShellsContext);
}
