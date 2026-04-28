import { GoldenShellIcon } from "../GoldenShells/GoldenShellIcon";
import { GoldenShellModal } from "../GoldenShells/GoldenShellModal";
import { useOptionalGoldenShells } from "../GoldenShells/GoldenShellsProvider";

export function HeaderGoldenShellIcon() {
  const goldenShells = useOptionalGoldenShells();

  if (!goldenShells) return null;

  return (
    <>
      <GoldenShellIcon />
      <GoldenShellModal />
    </>
  );
}
