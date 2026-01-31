export type Book = {
  slug: string;
  title: string;
  subtitle?: string;
  thumbnailSrc: string;
  pagesCount: number;
  isLocked?: boolean;
  summary?: string;
};

export const BOOKS: Book[] = [
  {
    slug: "the-mission-begins",
    title: "book.theMissionBegins.title",
    subtitle: "book.theMissionBegins.subtitle",
    summary: "book.theMissionBegins.summary",
    thumbnailSrc: "/books/intro/cover.jpg",
    pagesCount: 10,
    isLocked: false,
  },
  {
    slug: "meet-characters",
    title: "book.meetCharacters.title",
    subtitle: "book.meetCharacters.subtitle",
    thumbnailSrc: "/books/intro/cover.jpg",
    pagesCount: 10,
    isLocked: true,
  },
  {
    slug: "landing-on-earth",
    title: "book.landingOnEarth.title",
    subtitle: "book.landingOnEarth.subtitle",
    thumbnailSrc: "/books/intro/cover.jpg",
    pagesCount: 10,
    isLocked: true,
  },
];
