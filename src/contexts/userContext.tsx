import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  saveChildFirstName,
  unlockBook as unlockBookRequest,
} from "../requests";
import { supabase } from "../auth/supabaseClient";

export type UnlockedBookSource = "free" | "preview_code" | "stripe";

export type UnlockedBookEntry = {
  source: UnlockedBookSource;
};

export type UnlockedBooks = Record<string, UnlockedBookEntry>;

export type GoldenShellsStore = {
  version: number;
  byBooklet: Record<string, Record<string, boolean>>;
  totalEarned: number;
  sessionEarnedByBooklet: Record<string, number>;
};

type UserState = {
  childFirstName: string | null;
  goldenShells: GoldenShellsStore | null;
  unlockedBooks: UnlockedBooks;
  isLoaded: boolean;
  introStage?: string | null;

  setChildFirstName: (name: string) => Promise<void>;
  setGoldenShells: (store: GoldenShellsStore) => void;
  unlockBook: (bookSlug: string) => Promise<void>;
  reload: () => Promise<void>;
};

const Ctx = createContext<UserState | null>(null);

export function useUserState() {
  const value = useContext(Ctx);

  if (!value) {
    throw new Error("useUserState must be used inside UserStateProvider");
  }

  return value;
}

async function fetchUserStateRow() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_state")
    .select("child_first_name, golden_shells, unlocked_books, intro_stage")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  return data ?? null;
}

export function UserStateProvider({ children }: { children: React.ReactNode }) {
  const [childFirstName, setChildFirstNameLocal] = useState<string | null>(
    null,
  );

  const [goldenShells, setGoldenShellsLocal] =
    useState<GoldenShellsStore | null>(null);

  const [unlockedBooks, setUnlockedBooksLocal] = useState<UnlockedBooks>({});

  const [introStage, setIntroStageLocal] = useState<string | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const saveTimer = useRef<number | null>(null);

  const setChildFirstName = async (name: string) => {
    const trimmed = name.trim();

    if (!trimmed) return;

    setChildFirstNameLocal(trimmed);

    await saveChildFirstName(trimmed);
  };

  const reload = async () => {
    setIsLoaded(false);

    const row = await fetchUserStateRow();

    setChildFirstNameLocal((row?.child_first_name as string | null) ?? null);

    setGoldenShellsLocal(
      (row?.golden_shells as GoldenShellsStore | null) ?? null,
    );

    setUnlockedBooksLocal((row?.unlocked_books as UnlockedBooks | null) ?? {});

    setIntroStageLocal((row?.intro_stage as string | null) ?? null);

    setIsLoaded(true);
  };

  const scheduleSaveGoldenShells = (next: GoldenShellsStore) => {
    setGoldenShellsLocal(next);

    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }

    saveTimer.current = window.setTimeout(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase.from("user_state").upsert(
        {
          user_id: user.id,
          golden_shells: next,
        },
        {
          onConflict: "user_id",
        },
      );
    }, 800);
  };

  const unlockBook = async (bookSlug: string) => {
    await unlockBookRequest(bookSlug);
    await reload();
  };

  useEffect(() => {
    reload().catch(() => setIsLoaded(true));

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      reload().catch(() => setIsLoaded(true));
    });

    return () => {
      sub.subscription.unsubscribe();

      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<UserState>(
    () => ({
      childFirstName,
      goldenShells,
      unlockedBooks,
      isLoaded,
      introStage,
      setChildFirstName,
      setGoldenShells: scheduleSaveGoldenShells,
      unlockBook,
      reload,
    }),
    [childFirstName, goldenShells, unlockedBooks, isLoaded, introStage],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
