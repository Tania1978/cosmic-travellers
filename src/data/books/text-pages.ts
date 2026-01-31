import { artCreditsParagraphs, writerNotesParagraphs } from "../texts/texts";

export type TextPage = {
  url: string;
  bgSrc: string;
  title: string;
  signature?: string;
  paragraphs: string[];
};

export const TEXTPAGES: Record<string, TextPage> = {
  "/writer-notes": {
    url: "/writer-notes",
    bgSrc: "/ui/bg5.jpg",
    title: "credits.writerNote",
    paragraphs: writerNotesParagraphs,
    signature: "credits.creatorName",
  },
  "/art-credits": {
    url: "/art-credits",
    bgSrc: "/ui/bg5.jpg",
    title: "credits.title",
    paragraphs: artCreditsParagraphs,
    signature: "credits.creatorName",
  },
};
