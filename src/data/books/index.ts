import { INTRO_BOOK } from "./introBook";
import type { BookConfig } from "./introBook";

export const BOOKS: Record<string, BookConfig> = {
  [INTRO_BOOK.slug]: INTRO_BOOK,
};
