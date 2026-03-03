
import { GoldenShellIcon } from "./GoldenShellIcon";
import { GoldenShellModal } from "./GoldenShellModal";
import { ShellSatchel } from "./ShellSatchel";
import { StoryMagicFxOverlay } from "./StoryMagicFxOverlay";

export function GoldenShellOverlay() {


  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 200, // IMPORTANT: force above player
        isolation: "isolate", // IMPORTANT: avoids blend-mode weirdness
      }}
    >
      <ShellSatchel />
      <GoldenShellIcon />
      <StoryMagicFxOverlay />
      <GoldenShellModal />
    </div>
  );
}
