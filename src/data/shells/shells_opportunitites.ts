import type { ShellOpportunity } from "../../GoldenShells/types";

export const BOOKLET2_SHELLS: ShellOpportunity[] = [
  {
    bookletId: "the-mission-begins",
    id: "the-mission-begins",
    page: 2,
    question: "Where is Earth?",
    choices: [
      { id: "a", label: "🌍 A planet around a star" },
      { id: "b", label: "☁️ A cloud in the sky" },
      { id: "c", label: "🔥 Inside the Sun" },
    ],
    correctChoiceId: "a",
  },
  {
    bookletId: "the-mission-begins",
    id: "firstLife",
    page: 3,
    question: "What were the first living things like?",
    choices: [
      { id: "a", label: "🦖 Giant animals" },
      { id: "b", label: "🌱 Trees and flowers" },
      { id: "c", label: "🔬 Tiny microbes" },
    ],
    correctChoiceId: "c",
  },
  {
    bookletId: "the-mission-begins",
    id: "water",
    page: 4,
    question: "What makes life on Earth possible?",
    choices: [
      { id: "a", label: "🌬 Air" },
      { id: "b", label: "💧 Water" },
      { id: "c", label: "🪨 Rocks" },
    ],
    correctChoiceId: "b",
  },
];
