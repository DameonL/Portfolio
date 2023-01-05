import { VNode } from "preact";
import { useEffect, useRef } from "preact/hooks";
import DesktopWindowState from "./DesktopWindowState";
import { makeDraggable } from "./makeDraggable";
import styles from "./windows.module.css";

interface DesktopWindowProps {
  state: DesktopWindowState;
  updateState: (newState: DesktopWindowState) => void;
  content: VNode<HTMLElement>;
}

export default function DesktopWindow(props: DesktopWindowProps) {
  const { state, content, updateState } = props;
  const titlebarRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titlebarRef.current || !windowRef.current) return;

    const dragSettings = makeDraggable(
      titlebarRef.current,
      windowRef.current,
      state,
      updateState
    );
    dragSettings.register();
    return () => {
      dragSettings.unregister();
    };
  }, []);

  return (
    <div
      ref={windowRef}
      class={styles.desktopWindow}
      style={`left: ${state.position.x}px; top: ${state.position.y}px; z-index: ${state.position.z}; `}
    >
      <div ref={titlebarRef} class={styles.desktopWindowTitlebar}>
        {state.title}
      </div>
      <div class={styles.desktopWindowContent}>{content}</div>
    </div>
  );
}
