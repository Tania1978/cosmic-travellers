import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { Session } from "@supabase/supabase-js";


export function useUserState() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [entitlements, setEntitlements] = useState<string[]>([]);
  const [childName, setChildName] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);

      if (data.session) {
        await loadUserData(data.session.user.id);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session) {
          await loadUserData(session.user.id);
        } else {
          setEntitlements([]);
          setChildName(null);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
    // 📚 Fetch unlocked books
    const { data: books } = await supabase
      .from("entitlements")
      .select("book_slug")
      .eq("user_id", userId);

    setEntitlements(books?.map((b) => b.book_slug) ?? []);

    //  Fetch child display name
    const { data: profile } = await supabase
      .from("profiles")
      .select("child_display_name")
      .eq("user_id", userId)
      .single();

    setChildName(profile?.child_display_name ?? null);
  };

  return {
    session,
    loading,
    isLoggedIn: !!session,
    entitlements,
    childName,
  };
}
