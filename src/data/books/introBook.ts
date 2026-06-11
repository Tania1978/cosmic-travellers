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
  videoPath: string;
  chapters: Chapter[];
  requiredShellIds?: string[]; // ✅ NEW (for hidden chapters)
  shellCompletionVideoSrc?: string;
  thumbnailSrc: string;
};

export const INTRO_BOOK: BookConfig = {
  slug: "the-mission-begins",
  title: "The Mission Begins",
  subtitle: "A Series Introduction Booklet",
  thumbnailSrc: "/books/intro/cover.jpg",
  videoPath: "the-mission-begins/final-intro-music-optimized.mp4",

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
  videoPath: "booklet-2/booklet-2-music-optimized.mp4",
  thumbnailSrc: "/books/chapter/cover_2.png",
  shellCompletionVideoSrc: "/books/chapter/booklet-2-message.mp4",
  requiredShellIds: ["first-life", "origin-life"],
  chapters: [
    { page: 1, start: 0, end: 6 },

    { page: 2, start: 6, end: 31 },
    { page: 3, start: 31, end: 43 },
    { page: 4, start: 43, end: 79 },
    { page: 5, start: 79, end: 106 },
    { page: 6, start: 106, end: 169 },
    { page: 7, start: 169, end: 203 },
    { page: 8, start: 203, end: 230 },
    { page: 9, start: 231, end: 247 },

    { page: 10, start: 247, end: 267 },
    { page: 11, start: 267, end: 294 },
    { page: 12, start: 294, end: 321 },
    { page: 13, start: 321, end: 359 },
  ],
};

export const THIRD_BOOK: BookConfig = {
  slug: "booklet-3",
  title: "Third Booklet",
  subtitle: "Cosmic Travellers",
  thumbnailSrc: "/books/chapter/cover_3.png",
  videoPath: "booklet-3/booklet-3-music-optimized.mp4",
  shellCompletionVideoSrc: "/books/chapter/booklet-3-message.mp4",
  requiredShellIds: [
    "stars-are-suns",
    "solar-system",
    "gravity",
    "galaxy-home",
    "life-water",
  ],
  chapters: [
    { page: 1, start: 0, end: 5 }, // 1A.mp4
    { page: 2, start: 5, end: 37 }, // 1b.mp4 (32s)
    { page: 3, start: 37, end: 70 }, // 2.mp4 (33s)
    { page: 4, start: 70, end: 94 }, // 3.mp4 (24s)
    { page: 5, start: 94, end: 141 }, // 3a.mp4 (47s)
    { page: 6, start: 141, end: 172 }, // 3c.mp4 (31s)
    { page: 7, start: 172, end: 195 }, // 3d.mp4 (23s)
    { page: 8, start: 195, end: 225 }, // 4.mp4 (30s)
    { page: 9, start: 225, end: 235 }, // 5.mp4 (10s)
    { page: 10, start: 235, end: 251 }, // 6.mp4 (14s)
    { page: 11, start: 251, end: 267 }, // 7.mp4 (16s)
    { page: 12, start: 267, end: 284 }, // 7b.mp4 (17s)
    { page: 13, start: 284, end: 290 }, // 8.mp4 (4s)
    { page: 14, start: 290, end: 321 }, // 9.mp4 (31s)
  ],
};

export const FOURTH_BOOK: BookConfig = {
  slug: "booklet-4",
  title: "Fourth Booklet",
  subtitle: "Cosmic Travellers",
  videoPath: "booklet-4/booklet-4-music-optimized.mp4",
  thumbnailSrc: "/books/chapter/cover_3.png",
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
