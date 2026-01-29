export const theme = {
  colors: {
    ink: "#3b196f",
    inkSoft: "rgba(59, 25, 111, 0.72)",
    inkBlue: "#364a72",
    bg: "#070914",
    bgCard: "rgba(255, 255, 255, 0.06)",
    bgCardStrong: "rgba(255, 255, 255, 0.10)",
    gold: "#FFD76A",
    goldDeep: "#F5A623",
    glowGold: "rgba(255, 215, 120, 0.55)",
    muted: "rgba(255,255,255,0.65)",
    disabled: "rgba(255,255,255,0.35)",
    danger: "#D84A4A",
  },

  space: (n: number) => `${n * 4}px`,

  radii: {
    sm: "10px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },

  typography: {
    fontFamily: `'Nunito', system-ui, sans-serif`,
    sizes: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "20px",
      xl: "28px",
    },
    weight: {
      regular: 400,
      medium: 600,
      bold: 700,
    },
  },

  motion: {
    slow: "600ms",
    slower: "1200ms",
    ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  },

  shadows: {
    soft: "0 8px 30px rgba(0,0,0,0.25)",
    glowGold: "0 0 18px rgba(255, 215, 120, 0.25)",
  },
} as const;

export type AppTheme = typeof theme;
