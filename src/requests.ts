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
  console.log("load user state called from preview access");
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

export async function setIntroStage(stage: "ask_name" | "welcome" | "done") {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("user_state")
    .update({ intro_stage: stage })
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function redeemPreviewCode(code: string) {
  const { data, error } = await supabase.functions.invoke(
    "redeem-preview-code",
    {
      body: { code },
    },
  );

  if (error) throw error;

  return data;
}

export async function submitReview(answers: Record<string, string | number>) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const reviewer_name =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? "Anonymous";

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      user_id: user.id,
      reviewer_name,
      answers,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  await getReviews();
  return data;
}

export type Review = {
  id: string;
  user_id: string | null;
  answers: Record<string, string | number>;
  created_at: string;
  reviewer_name: string;
};

export async function getReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, user_id, reviewer_name, answers, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Review[];
}
