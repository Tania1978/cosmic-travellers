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
    title: "A Note from the Author ✨",
    paragraphs: writerNotesParagraphs,
    signature: "Tania Karageorgi",
  },
  "/art-credits": {
    url: "/art-credits",
    bgSrc: "/ui/bg5.jpg",
    title: "Art & Visual Credits to Ioustini Giannakopoulou ✨",
    paragraphs: artCreditsParagraphs,
    signature: "Tania Karageorgi",
  },
};
