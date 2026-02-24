export type Book = {
  slug: string;
  title: string;
  subtitle?: string;
  thumbnailSrc: string;
  pagesCount: number;
  isLocked?: boolean;
  summary?: string;
  number: number;
};

export const BOOKS: Book[] = [
  {
    slug: "the-mission-begins",
    title: "book.theMissionBegins.title",
    subtitle: "book.theMissionBegins.subtitle",
    summary: "book.theMissionBegins.summary",
    thumbnailSrc: "/books/intro/cover.jpg",
    pagesCount: 16,
    isLocked: false,
    number: 1,
  },
  {
    slug: "booklet-2",
    title: "book.booklet_2.title",
    subtitle: "book.booklet_2.subtitle",
    summary: "book.booklet_2.summary",
    thumbnailSrc: "/books/chapter/cover_2.png",
    pagesCount: 14,
    isLocked: true,
    number: 2,
  },
  {
    slug: "landing-on-earth",
    title: "book.landingOnEarth.title",
    subtitle: "book.landingOnEarth.subtitle",
    thumbnailSrc: "/books/intro/cover.jpg",
    pagesCount: 10,
    isLocked: true,
    number: 3,
  },
];
