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
    { page: 1, start: 0.0, end: 5.0 },
    { page: 2, start: 5.0, end: 18 },
    { page: 3, start: 18, end: 32.17 },
    { page: 4, start: 32.17, end: 50.28 },
    { page: 5, start: 50.28, end: 116.2 },
    { page: 6, start: 116.2, end: 142.11 },
    { page: 7, start: 142.11, end: 159.15 },
    { page: 8, start: 159.15, end: 209.11 },
    { page: 9, start: 209.11, end: 259.08 },
    { page: 10, start: 259.08, end: 409.09 },
    { page: 11, start: 409.09, end: 428.08 },
  ],
};
