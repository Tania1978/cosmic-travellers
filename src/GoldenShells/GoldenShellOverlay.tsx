
import { GoldenShellIcon } from "./GoldenShellIcon";
import { GoldenShellModal } from "./GoldenShellModal";
import { ShellSatchel } from "./ShellSatchel";
import { StoryMagicFxOverlay } from "./StoryMagicFxOverlay";

export function GoldenShellOverlay() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <ShellSatchel />
      <GoldenShellIcon />
      <StoryMagicFxOverlay />
      <GoldenShellModal />
    </div>
  );
}
