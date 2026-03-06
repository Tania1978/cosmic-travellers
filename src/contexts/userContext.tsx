import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { saveChildFirstName, unlockBook } from "../requests";
import { supabase } from "../auth/supabaseClient";

export type GoldenShellsStore = {
  version: number;
  byBooklet: Record<string, Record<string, boolean>>;
  totalEarned: number;
  sessionEarnedByBooklet: Record<string, number>;
};

type UserState = {
  childFirstName: string | null;
  goldenShells: GoldenShellsStore | null;
  unlockedBooks: string[];
  isLoaded: boolean;
  introStage?: string;

  setChildFirstName: (name: string) => Promise<void>;
  setGoldenShells: (store: GoldenShellsStore) => void; // local update (we persist with debounce)
  unlockBook: (bookSlug: string) => Promise<void>;

  reload: () => Promise<void>;
};

const Ctx = createContext<UserState | null>(null);

export function useUserState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUserState must be used inside UserStateProvider");
  return v;
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
  const [unlockedBooks, setUnlockedBooksLocal] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // simple debounce so you don't spam Supabase when shells update
  const saveTimer = useRef<number | null>(null);

  const setChildFirstName = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setChildFirstNameLocal(trimmed);

    await saveChildFirstName(trimmed);

    // optional safety: if you want to ensure DB is source of truth
    // await reload();
  };

  const reload = async () => {
    setIsLoaded(false);
    const row = await fetchUserStateRow();

    setChildFirstNameLocal((row?.child_first_name as string | null) ?? null);
    setGoldenShellsLocal(
      (row?.golden_shells as GoldenShellsStore | null) ?? null,
    );
    setUnlockedBooksLocal((row?.unlocked_books as string[] | null) ?? []);

    setIsLoaded(true);
  };

  const scheduleSaveGoldenShells = (next: GoldenShellsStore) => {
    setGoldenShellsLocal(next);

    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("user_state")
        .upsert(
          { user_id: user.id, golden_shells: next },
          { onConflict: "user_id" },
        );
    }, 800);
  };

  // When do we fetch? -> right after auth session is known.
  useEffect(() => {
    // 1) initial load
    reload().catch(() => setIsLoaded(true));

    // 2) if auth changes (login/logout), reload
    const { data: sub } = supabase.auth.onAuthStateChange((_event) => {
      reload().catch(() => setIsLoaded(true));
    });

    return () => {
      sub.subscription.unsubscribe();
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<UserState>(
    () => ({
      childFirstName,
      goldenShells,
      unlockedBooks,
      isLoaded,
      setChildFirstName: setChildFirstName,
      setGoldenShells: scheduleSaveGoldenShells,
      unlockBook: unlockBook,
      reload,
    }),
    [childFirstName, goldenShells, unlockedBooks, isLoaded, setChildFirstName],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
