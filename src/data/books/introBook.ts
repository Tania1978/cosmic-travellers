export type Chapter = {
  page: number;
  start: number;
  end: number;
  kind?: "story" | "gratitude";
};

export type BookConfig = {
  slug: string;
  title: string;
  subtitle?: string;
  videoSrc: string;
  chapters: Chapter[];
};

export const INTRO_BOOK: BookConfig = {
  slug: "the-mission-begins",
  title: "The Mission Begins",
  subtitle: "A Series Introduction Booklet",
  videoSrc: "/books/intro/intro_full.mp4", // local for now
  chapters: [
    { page: 1, start: 0, end: 6 },
    { page: 2, start: 6, end: 18 },
    { page: 3, start: 18, end: 33 },
    { page: 4, start: 33, end: 53 },
    { page: 5, start: 53, end: 76 },
    { page: 6, start: 76, end: 101 },
    { page: 7, start: 101, end: 121 },
    { page: 8, start: 121, end: 163 },
    { page: 9, start: 163, end: 187 },
    { page: 10, start: 187, end: 204 },
    { page: 11, start: 204, end: 219 },
    { page: 12, start: 219, end: 235 },
    { page: 13, start: 235, end: 262 },
    { page: 14, start: 262, end: 295 },
    { page: 15, start: 295, end: 360 },
    { page: 16, start: 360, end: 381 },
  ],
};

export const SECOND_BOOK: BookConfig = {
  slug: "booklet-2",
  title: "Second Booklet",
  subtitle: "Cosmic Travellers",
  videoSrc: "/books/chapter/second_full_keyframed.mp4",
  chapters: [
    { page: 1, start: 0, end: 5.02 }, // cover
    { page: 2, start: 5.02, end: 30.04 },
    { page: 3, start: 30.04, end: 42.13 },
    { page: 4, start: 42.13, end: 82.15 },
    { page: 5, start: 82.15, end: 112.17 },
    { page: 6, start: 112.17, end: 184.19 },
    { page: 7, start: 184.19, end: 218.21 },
    { page: 8, start: 218.21, end: 248.3 },
    { page: 9, start: 248.3, end: 264.56 }, // clip 8
    { page: 10, start: 264.56, end: 284.58 }, // clip 8b
    { page: 11, start: 284.58, end: 308.6 },
    { page: 12, start: 308.6, end: 338.77 },
    { page: 13, start: 338.77, end: 376.94 },
    { page: 14, start: 376.94, end: 391.187007 }, // extend to actual file duration
  ],
};
