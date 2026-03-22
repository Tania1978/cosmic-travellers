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
  videoSrc: "/books/chapter/final-1-music.mp4",
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
    { page: 14, start: 383, end: 395, hidden: true },
  ],
};

export const THIRD_BOOK: BookConfig = {
  slug: "booklet-3",
  title: "Third Booklet",
  subtitle: "Cosmic Travellers",
  videoSrc: "/books/chapter/final-music-2.mp4",
  requiredShellIds: [
    "stars-are-suns",
    "solar-system",
    "galaxy-home",
    "life-water",
  ],
  chapters: [
    { page: 1, start: 0, end: 5 },

    { page: 2, start: 5, end: 41 },
    { page: 3, start: 41, end: 78 },
    { page: 4, start: 78, end: 104 },
    { page: 5, start: 104, end: 139 },
    { page: 6, start: 139, end: 163 },
    { page: 7, start: 163, end: 193 },
    { page: 8, start: 193, end: 211 },
    { page: 9, start: 211, end: 231 },

    { page: 10, start: 231, end: 279 },
    { page: 11, start: 279, end: 313 },
    { page: 12, start: 313, end: 322, hidden: true },
  ],
};
export const BOOKSPAGES: BookConfig[] = [INTRO_BOOK, SECOND_BOOK, THIRD_BOOK];
