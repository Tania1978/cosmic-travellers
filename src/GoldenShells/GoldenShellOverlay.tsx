


import { ShellSatchel } from "./ShellSatchel";


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
      
    </div>
  );
}
