type BookEndingVideo = {
  src: string;
  requiresAllShells: boolean;
};

export type Book = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  thumbnailSrc: string;
  pagesCount: number;
  isLocked: boolean;
  number: number;
  requiredShellIds?: string[];
  endingVideo?: BookEndingVideo;
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
    pagesCount: 13,
    isLocked: false,
    number: 2,
    endingVideo: {
      src: "/books/booklet-2-message.mp4",
      requiresAllShells: true,
    },
  },
  {
    slug: "booklet-3",
    title: "book.booklet_3.title",
    subtitle: "book.booklet_3.subtitle",
    summary: "book.booklet_3.summary",
    thumbnailSrc: "/books/chapter/cover_3.png",
    pagesCount: 10,
    isLocked: false,
    number: 3,
  },
];

export const INTRO_VIDEOS: Record<string, string> = {
  ask_name: "/videos/mr-sebba-intro.mp4",
  welcome: "/videos/timba-welcome.mp4",
};

export const INTRO_STAGE = {
  ASK_NAME: "ask_name",
  WELCOME: "welcome",
  DONE: "done",
} as const;

export type IntroStage = (typeof INTRO_STAGE)[keyof typeof INTRO_STAGE];

export const INTRO_VIDEO_MAP = {
  [INTRO_STAGE.ASK_NAME]: {
    en: "/videos/en/sebba-msg",
    el: "/videos/el/sebba-msg",
  },

  [INTRO_STAGE.WELCOME]: {
    en: "/videos/en/mr-sebba-welcome.mp4",
    el: "/videos/el/mr-sebba-welcome.mp4",
  },

  [INTRO_STAGE.DONE]: {
    en: null,
    el: null,
  },
} as const;
