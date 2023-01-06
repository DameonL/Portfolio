import { MutableRef, StateUpdater, useRef, useState } from "preact/hooks";

import styles from "./desktop.module.css";
import "./globals.css";
import DesktopMenu from "./DesktopMenu";
import DesktopWindows from "./Windows/DesktopWindows";
import DesktopWindowState from "./Windows/DesktopWindowState";
import DesktopIcon from "./DesktopIcon";
import { VNode } from "preact";
import AboutWindow from "./Windows/AboutWindow";
let windows: DesktopWindowState[],
  setWindows: StateUpdater<DesktopWindowState[]>;

export let desktop: MutableRef<HTMLDivElement>;

export function openWindow(
  type: (props: { state: DesktopWindowState }) => VNode<HTMLElement>,
  title: string
) {
  const state: DesktopWindowState = {
    type,
    title,
    position: { x: 0, y: 0, z: 0 },
    size: { height: 300, width: 300 },
    update: () => updateWindow(state),
    close: () => closeWindow(state),
  };

  state.uuid = self.crypto.randomUUID();
  windows.push(state);
  setWindows([...windows]);
}

export default function Desktop() {
  [windows, setWindows] = useState<DesktopWindowState[]>([]);
  desktop = useRef<HTMLDivElement>(null);

  return (
    <div>
      <DesktopMenu />
      <div
        class={styles.desktop}
        ref={desktop}
        style={{
          height: `${window.innerHeight}px`,
          width: `${window.innerWidth}px`,
        }}
      >
        <DesktopIcon label="GitHub" image={<div>🔗</div>} onClick={() => {
          window.open("https://github.com/DameonL", "_blank");
        }} />
        <DesktopWindows windows={windows} />
      </div>
    </div>
  );
}

function closeWindow(state: DesktopWindowState) {
  windows.splice(windows.indexOf(state), 1);
  setWindows([...windows]);
}

function updateWindow(window: DesktopWindowState) {
  const index = windows.findIndex((x) => x.uuid === window.uuid);
  windows[index] = window;
  setWindows([...windows]);
}
