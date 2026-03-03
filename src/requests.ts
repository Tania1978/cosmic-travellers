import { supabase } from "./auth/supabaseClient";
import type { GoldenShellsStore, UserStateRow } from "./GoldenShells/types";

export async function saveChildFirstName(childFirstName: string) {
  const name = childFirstName.trim();
  if (!name) return;

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) throw userErr;
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("user_state")
    .upsert(
      { user_id: user.id, child_first_name: name },
      { onConflict: "user_id" },
    );

  if (error) throw error;
}

export async function loadUserState(
  userId: string,
): Promise<UserStateRow | null> {
  const { data, error } = await supabase
    .from("user_state")
    .select("user_id, child_first_name, golden_shells, unlocked_books")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  const row = (data as UserStateRow) ?? null;
  return row;
}

export async function saveGoldenShells(store: GoldenShellsStore) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("user_state")
    .upsert(
      { user_id: user.id, golden_shells: store },
      { onConflict: "user_id" },
    );

  if (error) throw error;
}

export async function unlockBook(bookSlug: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // load current list
  const { data, error } = await supabase
    .from("user_state")
    .select("unlocked_books")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  const current: string[] = (data?.unlocked_books as any) ?? [];
  const next = current.includes(bookSlug) ? current : [...current, bookSlug];

  const { error: upsertErr } = await supabase
    .from("user_state")
    .upsert(
      { user_id: user.id, unlocked_books: next },
      { onConflict: "user_id" },
    );

  if (upsertErr) throw upsertErr;
}
