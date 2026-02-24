import type { ShellOpportunity } from "../../GoldenShells/types";

export const BOOKLET2_SHELLS: ShellOpportunity[] = [
  {
    bookletId: "booklet-2",
    id: "first-life",
    page: 14,
    question: "What were the first living things like?",
    choices: [
      { id: "a", label: "🦖 Small animals" },
      { id: "b", label: "🌱 Trees and flowers" },
      { id: "c", label: "🔬 Tiny microbes" },
    ],
    correctChoiceId: "c",
  },
  {
    bookletId: "booklet-2",
    id: "origin-life",
    page: 14,
    question: "Where did life begin on Earth?",
    choices: [
      { id: "a", label: "In the air" },
      { id: "b", label: "In the water" },
      { id: "c", label: "In the soil" },
    ],
    correctChoiceId: "b",
  },
];
