export type Chapter = {
  page: number;
  start: number;
  end: number;
  kind?: string;
  hidden?: boolean;
};

export type BookConfig = {
  slug: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  chapters: Chapter[];
  requiredShellIds?: string[]; // ✅ NEW (for hidden chapters)
  shellCompletionVideoSrc?: string;
};

export const INTRO_BOOK: BookConfig = {
  slug: "the-mission-begins",
  title: "The Mission Begins",
  subtitle: "A Series Introduction Booklet",
  videoSrc: "/books/intro/final-intro-music.mp4",

  chapters: [
    { page: 1, start: 0, end: 6 },
    { page: 2, start: 6, end: 19 },
    { page: 3, start: 19, end: 40 },
    { page: 4, start: 40, end: 60 },
    { page: 5, start: 60, end: 92 },
    { page: 6, start: 92, end: 116 },

    // +1 from page 7 onwards
    { page: 7, start: 116, end: 147 },
    { page: 8, start: 147, end: 157 },

    // +1 more from page 9 onwards
    { page: 9, start: 157, end: 170 },

    // +1 more from page 10 onwards
    { page: 10, start: 170, end: 186 },
    { page: 11, start: 186, end: 202 },
    { page: 12, start: 202, end: 229 },

    // +1 more from page 13 onwards (final)
    { page: 13, start: 229, end: 237 },
    { page: 14, start: 237, end: 251 },
  ],
};

export const SECOND_BOOK: BookConfig = {
  slug: "booklet-2",
  title: "Second Booklet",
  subtitle: "Cosmic Travellers",
  videoSrc: "/books/chapter/booklet-2-music.mp4",
  shellCompletionVideoSrc: "/books/chapter/booklet-2-message.mp4",
  requiredShellIds: ["first-life", "origin-life"],
  chapters: [
    { page: 1, start: 0, end: 5 },

    // +1 from page 2 to 9
    { page: 2, start: 5, end: 31 },
    { page: 3, start: 31, end: 43 },
    { page: 4, start: 43, end: 83 },
    { page: 5, start: 83, end: 114 },
    { page: 6, start: 114, end: 186 },
    { page: 7, start: 186, end: 220 },
    { page: 8, start: 220, end: 250 },
    { page: 9, start: 250, end: 266 },

    // +2 from page 10 to 12
    { page: 10, start: 266, end: 290 },
    { page: 11, start: 290, end: 314 },
    { page: 12, start: 314, end: 344 },

    // +3 from page 13 onwards
    { page: 13, start: 344, end: 382 },
  ],
};

export const THIRD_BOOK: BookConfig = {
  slug: "booklet-3",
  title: "Third Booklet",
  subtitle: "Cosmic Travellers",
  videoSrc: "/books/chapter/booklet-3-music.mp4",
  requiredShellIds: [
    "stars-are-suns",
    "solar-system",
    "galaxy-home",
    "life-water",
  ],
  chapters: [
    { page: 1, start: 0, end: 4 }, // 1A.mp4 (5s)
    { page: 2, start: 4, end: 35.5 }, // 1B.mp4 (32s)
    { page: 3, start: 35.5, end: 73 }, // 2.mp4 (37s)
    { page: 4, start: 73, end: 99 }, // 3.mp4 (25s)
    { page: 5, start: 99, end: 130 }, // 4.mp4 (31s)
    { page: 6, start: 130, end: 154 }, // 5.mp4 (23s)
    { page: 7, start: 154, end: 182.5 }, // 6.mp4 (28s)
    { page: 8, start: 182.5, end: 199.5 }, // 7.mp4 (17s)
    { page: 9, start: 199.7, end: 217.32 }, // 7b.mp4 (17s)
    { page: 10, start: 217.32, end: 262.6 }, // 8.mp4 (45s)
    { page: 11, start: 262.6, end: 293.5 }, // 9.mp4 (31s)
  ],
};

export const FOURTH_BOOK: BookConfig = {
  slug: "booklet-4",
  title: "Fourth Booklet",
  subtitle: "Cosmic Travellers",
  videoSrc: "/books/chapter/booklet-4-music.mp4",
  shellCompletionVideoSrc: "/books/chapter/booklet-4-message.mp4",
  requiredShellIds: [
    "water-evaporation",
    "water-travel",
    "rain-paths",
    "water-states",
  ],
  chapters: [
    { page: 1, start: 0, end: 5 },
    { page: 2, start: 5, end: 25 },
    { page: 3, start: 25, end: 50 },
    { page: 4, start: 50, end: 82 },
    { page: 5, start: 82, end: 118 },
    { page: 6, start: 118, end: 149 },
    { page: 7, start: 149, end: 193 },
    { page: 8, start: 193, end: 234 },
    { page: 9, start: 234, end: 278 },
    { page: 10, start: 278, end: 316 },
    { page: 11, start: 316, end: 365 },
    { page: 12, start: 365, end: 392 },
    { page: 13, start: 392, end: 421 },
    { page: 14, start: 421, end: 456 },
  ],
};

export const BOOKSPAGES: BookConfig[] = [
  INTRO_BOOK,
  SECOND_BOOK,
  THIRD_BOOK,
  FOURTH_BOOK,
];
