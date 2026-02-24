import { INTRO_BOOK, SECOND_BOOK } from "./introBook";
import type { BookConfig } from "./introBook";

export const BOOKS: Record<string, BookConfig> = {
  [INTRO_BOOK.slug]: INTRO_BOOK,
  [SECOND_BOOK.slug]: SECOND_BOOK,
};
