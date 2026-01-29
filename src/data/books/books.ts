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
    title: "How the Mission Began",
    subtitle: "A Series Introduction Booklet",
    thumbnailSrc: "/books/intro/cover.jpg",
    summary: `Four young travellers from a faraway world create Magical Glasses that can see the hidden language of nature. As a reward, they are sent on their first journey through space. 
      
      Guided by a mysterious message, they head toward Earth to explore how life works — together with the children reading their story. 
      
      A calm and magical introduction to the Cosmic Travellers series, where future adventures gently explore science, nature, and the wonders of our world.`,
    pagesCount: 10,
    isLocked: false,
  },
  {
    slug: "meet-chracters",
    title: "The Amazing Five",
    subtitle: "Meet the Main Characters",
    thumbnailSrc: "/books/intro/cover.jpg",
    pagesCount: 10,
    isLocked: true,
  },
  {
    slug: "landing-on-earth`",
    title: "  Landing on Earth",
    subtitle: "The First Adventure",
    thumbnailSrc: "/books/intro/cover.jpg",
    pagesCount: 10,
    isLocked: true,
  },
];
