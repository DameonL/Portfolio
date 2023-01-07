import {
  MutableRef,
  StateUpdater,
  useEffect,
  useRef,
  useState,
} from "preact/hooks";

import { VNode } from "preact";
import styles from "./desktop.module.css";
import DesktopIcon from "./DesktopIcon";
import DesktopMenu from "./DesktopMenu";
import "./globals.css";
import DesktopWindows from "./Windows/DesktopWindows";
import DesktopWindowState from "./Windows/DesktopWindowState";
import SamplesWindow from "./Windows/Samples/SamplesWindow";
let windows: DesktopWindowState<any>[],
  setWindows: StateUpdater<DesktopWindowState<any>[]>;

export let desktop: MutableRef<HTMLDivElement>;

export function openWindow<T>(
  type: (props: { state: DesktopWindowState<T> }) => VNode<HTMLElement>,
  props: T | undefined,
  title: string
) {
  const state: DesktopWindowState<T> = {
    type,
    title,
    position: { x: 0, y: 0, z: 0 },
    size: {
      height: desktop.current.clientHeight * 0.5,
      width: desktop.current.clientWidth * 0.5,
    },
    update: () => updateWindow(state),
    close: () => closeWindow(state),
    windowProps: props,
  };

  state.uuid = self.crypto.randomUUID();
  windows.push(state);
  setWindows([...windows]);
  return state;
}

export default function Desktop() {
  [windows, setWindows] = useState<DesktopWindowState<any>[]>([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  desktop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onWindowResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return (
    <div
      style={{
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
      }}
    >
      <DesktopMenu />
      <div class={styles.desktop} ref={desktop}>
        <DesktopWindows windows={windows} />
        <DesktopIcon
          label="GitHub"
          image={<img draggable={false} src="./img/github-mark-white.svg" />}
          onClick={() => {
            window.open("https://github.com/DameonL", "_blank");
          }}
        />
        <DesktopIcon
          label="LinkedIn"
          image={<img draggable={false} style={{ filter: "grayscale(1) invert(1) brightness(2)" }} src="./img/LI-In-Bug.png" />}
          onClick={() => {
            window.open("https://www.linkedin.com/in/dameon-laird/", "_blank");
          }}
        />
        <DesktopIcon
          label="Samples"
          image={<div style={{ filter: "grayscale(1)" }}>📁</div>}
          onClick={() => {
            openWindow<any>(SamplesWindow, null, "Sample Websites");
          }}
        />
      </div>
    </div>
  );
}

function closeWindow(state: DesktopWindowState<any>) {
  windows.splice(windows.indexOf(state), 1);
  setWindows([...windows]);
}

function updateWindow(window: DesktopWindowState<any>) {
  const index = windows.findIndex((x) => x.uuid === window.uuid);
  windows[index] = window;
  setWindows([...windows]);
}
