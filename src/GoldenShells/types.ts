// goldenShells.types.ts
export type ShellId = string; // e.g. "space" | "firstLife" | "water"

export type ShellChoice = {
  id: string;
  label: string;
};

export type ShellOpportunity = {
  id: ShellId;
  bookletId: string; // e.g. "booklet2"
  question: string;
  choices: ShellChoice[];
  correctChoiceId: string;
  page?: number;
  timeRangeSec?: [number, number];
};

export type GoldenShellsStore = {
  version: number;
  byBooklet: Record<string, Record<ShellId, boolean>>;
  totalEarned: number;
  sessionEarnedByBooklet: Record<string, number>;
};

export const DEFAULT_STORE: GoldenShellsStore = {
  version: 1,
  byBooklet: {},
  totalEarned: 0,
  sessionEarnedByBooklet: {},
};
