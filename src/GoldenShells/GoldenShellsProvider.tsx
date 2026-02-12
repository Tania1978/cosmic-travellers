
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { GoldenShellsStore, ShellId, ShellOpportunity } from "./types";
import { loadShellsStore, saveShellsStore } from "./storage";

type ShellEarnedEvent = {
  type: "shellEarned";
  bookletId: string;
  shellId: ShellId;
  totalEarned: number;
  earnedThisSession: number;
};

type GoldenShellsContextValue = {
  bookletId: string;
  store: GoldenShellsStore;
  totalEarned: number;
  earnedThisSession: number;
  activeOpportunity: ShellOpportunity | null;
  isModalOpen: boolean;

  isShellEarned: (shellId: ShellId) => boolean;
  setActiveOpportunity: (opp: ShellOpportunity | null) => void;
  openModal: () => void;
  closeModal: () => void;

  submitAnswer: (choiceId: string) => { correct: boolean };

  lastEvent: ShellEarnedEvent | null;
  clearLastEvent: () => void;
  resetSessionEarned: () => void;
  fxPlayId: number;
  satchelEl: HTMLElement | null;
  setSatchelEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
};

const GoldenShellsContext = createContext<GoldenShellsContextValue | null>(
  null,
);

export function useGoldenShells() {
  const ctx = useContext(GoldenShellsContext);
  if (!ctx)
    throw new Error("useGoldenShells must be used within GoldenShellsProvider");
  return ctx;
}

type Props = {
  bookletId: string;
  children: React.ReactNode;
};

export function GoldenShellsProvider({ bookletId, children }: Props) {
  const [store, setStore] = useState<GoldenShellsStore>(() =>
    loadShellsStore(),
  );
  const [activeOpportunity, setActiveOpportunity] =
    useState<ShellOpportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [lastEvent, setLastEvent] = useState<ShellEarnedEvent | null>(null);
  const [fxPlayId, setFxPlayId] = useState(0);
  const [satchelEl, setSatchelEl] = useState<HTMLElement | null>(null);

  const triggerMagicFx = () => setFxPlayId((n) => n + 1);

  // Keep store in sync with localStorage
  useEffect(() => {
    saveShellsStore(store);
  }, [store]);

  // If booklet changes, close modal + clear active opportunity
  useEffect(() => {
    setIsModalOpen(false);
    setActiveOpportunity(null);
    setLastEvent(null);
  }, [bookletId]);

  const totalEarned = store.totalEarned;

  const earnedThisSession = store.sessionEarnedByBooklet[bookletId] ?? 0;

  const isShellEarned = (shellId: ShellId) => {
    return Boolean(store.byBooklet[bookletId]?.[shellId]);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const clearLastEvent = () => setLastEvent(null);

  const resetSessionEarned = () => {
    setStore((prev) => {
      const next: GoldenShellsStore = {
        ...prev,
        sessionEarnedByBooklet: {
          ...prev.sessionEarnedByBooklet,
          [bookletId]: 0,
        },
      };
      return next;
    });
  };

  const submitAnswer = (choiceId: string) => {
    const opp = activeOpportunity;
    if (!opp) return { correct: false };

    const correct = choiceId === opp.correctChoiceId;
    if (!correct) return { correct: false };

    // If already earned, don't double-count (still treat as correct)
    if (isShellEarned(opp.id)) {
      return { correct: true };
    }

    // Mark earned in store + bump totals
    setStore((prev) => {
      const prevBooklet = prev.byBooklet[bookletId] ?? {};
      const nextBooklet = { ...prevBooklet, [opp.id]: true };

      const nextSessionCount =
        (prev.sessionEarnedByBooklet[bookletId] ?? 0) + 1;

      const next: GoldenShellsStore = {
        ...prev,
        byBooklet: { ...prev.byBooklet, [bookletId]: nextBooklet },
        totalEarned: prev.totalEarned + 1,
        sessionEarnedByBooklet: {
          ...prev.sessionEarnedByBooklet,
          [bookletId]: nextSessionCount,
        },
      };

      // Also emit the story-fx event (synced to the success moment)
      // Note: setLastEvent isn't inside setStore to avoid stale closure issues.
      // We'll set it right after setStore below using refs.
      return next;
    });

    // Fire event (story FX + satchel pulse)
    // Use a microtask so store updates settle first.
    queueMicrotask(() => {
      const latest = loadShellsStore(); // safe read; store already saved in effect
      const earnedNow = latest.sessionEarnedByBooklet[bookletId] ?? 0;
      setLastEvent({
        type: "shellEarned",
        bookletId,
        shellId: opp.id,
        totalEarned: latest.totalEarned,
        earnedThisSession: earnedNow,
      });
    });

    triggerMagicFx();

    return { correct: true };
  };

  const value: GoldenShellsContextValue = useMemo(
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
      lastEvent,
      clearLastEvent,
      resetSessionEarned,
      fxPlayId,
      satchelEl,
      setSatchelEl,
    }),
    [
      bookletId,
      store,
      totalEarned,
      earnedThisSession,
      activeOpportunity,
      isModalOpen,
      lastEvent,
      fxPlayId,
      satchelEl,
      setSatchelEl,
    ],
  );

  return (
    <GoldenShellsContext.Provider value={value}>
      {children}
    </GoldenShellsContext.Provider>
  );
}
