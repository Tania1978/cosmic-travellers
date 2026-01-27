export type Book = {
  slug: string;
  title: string;
  subtitle?: string;
  thumbnailSrc: string;
  pagesCount: number;
  isLocked?: boolean;
};

export const BOOKS: Book[] = [
  {
    slug: "the-mission-begins",
    title: "How the Mission Began",
    subtitle: "A Series Introduction Booklet",
    thumbnailSrc: "/books/intro/cover.jpg",
    pagesCount: 10,
    isLocked: false,
  },
];
