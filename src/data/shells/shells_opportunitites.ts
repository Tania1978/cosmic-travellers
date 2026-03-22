import type { ShellOpportunity } from "../../GoldenShells/types";

export const BOOKLET2_SHELLS: ShellOpportunity[] = [
  {
    bookletId: "booklet-2",
    id: "first-life",
    page: 13,
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
    page: 13,
    question: "Where did life begin on Earth?",
    choices: [
      { id: "a", label: "In the air" },
      { id: "b", label: "In the water" },
      { id: "c", label: "In the soil" },
    ],
    correctChoiceId: "b",
  },
];

export const BOOKLET3_SHELLS: ShellOpportunity[] = [
  {
    bookletId: "booklet-3",
    id: "stars-are-suns",
    page: 3,
    question: "What are the stars we see in the night sky?",
    choices: [
      { id: "a", label: "✨ Tiny lights" },
      { id: "b", label: "☀️ Suns far away" },
      { id: "c", label: "🪐 Planets" },
    ],
    correctChoiceId: "b",
  },
  {
    bookletId: "booklet-3",
    id: "solar-system",
    page: 4,
    question: "What is our Solar System?",
    choices: [
      { id: "a", label: "🌌 A group of stars" },
      { id: "b", label: "☀️ The Sun and the planets around it" },
      { id: "c", label: "🌙 Just the Moon and Earth" },
    ],
    correctChoiceId: "b",
  },
  {
    bookletId: "booklet-3",
    id: "galaxy-home",
    page: 6,
    question: "Where do we live in space?",
    choices: [
      { id: "a", label: "🌌 In a galaxy called the Milky Way" },
      { id: "b", label: "☁️ In the clouds" },
      { id: "c", label: "🔥 Inside the Sun" },
    ],
    correctChoiceId: "a",
  },
  {
    bookletId: "booklet-3",
    id: "life-water",
    page: 9,
    question: "What makes life possible on Earth?",
    choices: [
      { id: "a", label: "💧 Water" },
      { id: "b", label: "🪨 Rocks" },
      { id: "c", label: "🌫️ Air only" },
    ],
    correctChoiceId: "a",
  },
];

export const ALL_SHELL_OPPORTUNITIES: ShellOpportunity[] = [
  ...BOOKLET2_SHELLS,
  ...BOOKLET3_SHELLS,
];
