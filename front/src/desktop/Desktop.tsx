import { StateUpdater, useState } from "preact/hooks";

import "./desktop.css";
import DesktopWindows from "./DesktopWindows";
import DesktopWindowState from "./DesktopWindowState";
let windows: DesktopWindowState[],
  setWindows: StateUpdater<DesktopWindowState[]>;

function openWindow(state: DesktopWindowState) {
  windows.push(state);
  setWindows([...windows]);
}

export default function Desktop() {
  [windows, setWindows] = useState<DesktopWindowState[]>([]);

  return (
    <div>
      <div
        onClick={() =>
          openWindow({ title: "A window", position: { x: 0, y: 0, z: 0 } })
        }
      >
        Open a Window
      </div>
      <DesktopWindows windows={windows} addWindow={openWindow} />
    </div>
  );
}
