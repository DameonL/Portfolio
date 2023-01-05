import { StateUpdater, useState } from "preact/hooks";

import styles from "./desktop.module.css";
import "./globals.css";
import DesktopMenu from "./DesktopMenu";
import DesktopWindows from "./Windows/DesktopWindows";
import DesktopWindowState from "./Windows/DesktopWindowState";
let windows: DesktopWindowState[],
  setWindows: StateUpdater<DesktopWindowState[]>;

function openWindow(state: DesktopWindowState) {
  state.uuid = self.crypto.randomUUID();
  windows.push(state);
  setWindows([...windows]);
}

export default function Desktop() {
  [windows, setWindows] = useState<DesktopWindowState[]>([]);

  function updateWindow(window: DesktopWindowState) {
    const index = windows.findIndex(x => x.uuid === window.uuid);
    windows[index] = window;
    setWindows([...windows]);
  }

  return (
    <div>
      <DesktopMenu />
      <div class={styles.desktop}>
        <div
          onClick={() =>
            openWindow({ title: "A window", position: { x: 15, y: 15, z: 0 } })
          }
        >
          Open a Window
        </div>
      </div>
      <DesktopWindows windows={windows} addWindow={openWindow} updateWindow={updateWindow}/>
    </div>
  );
}
