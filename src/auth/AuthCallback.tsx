import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function finishLogin() {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href,
      );

      if (error) {
        console.error("Auth callback error:", error);
        navigate("/", { replace: true });
        return;
      }

      navigate("/", { replace: true });
    }

    finishLogin();
  }, [navigate]);

  return null;
}
