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
import { useAuth } from "../auth/authContext";

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
  introStage: string | null;

  setChildFirstName: (name: string) => Promise<void>;
  setGoldenShells: (store: GoldenShellsStore) => void;
  unlockBook: (bookSlug: string) => Promise<void>;
  reload: () => Promise<void>;
  setUnlockedBooksLocal: React.Dispatch<React.SetStateAction<UnlockedBooks>>;
};

const Ctx = createContext<UserState | null>(null);

export function useUserState() {
  const value = useContext(Ctx);

  if (!value) {
    throw new Error("useUserState must be used inside UserStateProvider");
  }

  return value;
}

export function UserStateProvider({ children }: { children: React.ReactNode }) {
  const { authUser } = useAuth();

  const [childFirstName, setChildFirstNameLocal] = useState<string | null>(
    null,
  );
  const [goldenShells, setGoldenShellsLocal] =
    useState<GoldenShellsStore | null>(null);
  const [unlockedBooks, setUnlockedBooksLocal] = useState<UnlockedBooks>({});
  const [introStage, setIntroStageLocal] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveTimer = useRef<number | null>(null);

  const clearUserState = () => {
    setChildFirstNameLocal(null);
    setGoldenShellsLocal(null);
    setUnlockedBooksLocal({});
    setIntroStageLocal(null);
    setIsLoaded(true);
  };

  const reload = async () => {
    console.log("reload called authUser", authUser);
    if (!authUser) {
      clearUserState();
      return;
    }

    setIsLoaded(false);

    const { data, error } = await supabase
      .from("user_state")
      .select("child_first_name, golden_shells, unlocked_books, intro_stage")
      .eq("user_id", authUser.id)
      .maybeSingle();

    if (error) throw error;
    console.log("data after user state", data);

    setChildFirstNameLocal((data?.child_first_name as string | null) ?? null);

    setGoldenShellsLocal(
      (data?.golden_shells as GoldenShellsStore | null) ?? null,
    );

    setUnlockedBooksLocal((data?.unlocked_books as UnlockedBooks | null) ?? {});

    setIntroStageLocal((data?.intro_stage as string | null) ?? null);

    setIsLoaded(true);
  };

  const setChildFirstName = async (name: string) => {
    const trimmed = name.trim();

    if (!trimmed) return;

    setChildFirstNameLocal(trimmed);
    await saveChildFirstName(trimmed);
  };

  const scheduleSaveGoldenShells = (next: GoldenShellsStore) => {
    setGoldenShellsLocal(next);

    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }

    saveTimer.current = window.setTimeout(async () => {
      if (!authUser) return;

      await supabase.from("user_state").upsert(
        {
          user_id: authUser.id,
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
    reload().catch(() => {
      setIsLoaded(true);
    });

    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.id]);
  console.log("unlocked books");

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
      setUnlockedBooksLocal,
    }),
    [childFirstName, goldenShells, unlockedBooks, isLoaded, introStage],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
