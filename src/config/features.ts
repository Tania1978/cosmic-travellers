export const DISABLE_VIDEO =
  (import.meta.env.VITE_DISABLE_VIDEO ?? "").toString().toLowerCase() ===
  "true";
