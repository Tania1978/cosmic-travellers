import { BOOKLET2_SHELLS } from "../data/shells/shells_opportunitites";
import { useGoldenShellOpportunity } from "./useGoldenShellOpportunity";

export function ShellOpportunityBinder({
  page,
  videoRef,
  chapterEnd,
  buffer
}: {
  page: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  chapterEnd: number;
  buffer?: number;
}) {
  useGoldenShellOpportunity({
    page,
    opportunities: BOOKLET2_SHELLS, // swap per book if needed
    reveal: { type: "chapterEnd", videoRef, chapterEnd, buffer: buffer ?? 3 },
  });

  return null;
}
