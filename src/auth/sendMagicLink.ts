import { supabase } from "./supabaseClient";

export async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // user clicks the link and returns here
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) throw error;
}
