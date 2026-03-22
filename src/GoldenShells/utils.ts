import { BOOKLET2_SHELLS } from "../data/shells/shells_opportunitites";
import type { ShellOpportunity } from "./types";
import { useGoldenShellOpportunity } from "./useGoldenShellOpportunity";

export function ShellOpportunityBinder({
  page,
  videoRef,
  chapterEnd,
  buffer,
  opportunities,
}: {
  page: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  chapterEnd: number;
  buffer?: number;
  opportunities?: ShellOpportunity[];
}) {
  useGoldenShellOpportunity({
    page,
    opportunities: opportunities ?? BOOKLET2_SHELLS, // swap per book if needed
    reveal: { type: "chapterEnd", videoRef, chapterEnd, buffer: buffer ?? 3 },
  });

  return null;
}
