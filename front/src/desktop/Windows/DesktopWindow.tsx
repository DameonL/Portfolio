import { VNode } from "preact";
import { useEffect, useRef } from "preact/hooks";
import DesktopWindowState from "./DesktopWindowState";
import { makeDraggable } from "./makeDraggable";
import styles from "./windows.module.css";

interface DesktopWindowProps {
  state: DesktopWindowState<any>;
  content: VNode<HTMLElement>;
}

export default function DesktopWindow(props: DesktopWindowProps) {
  const { state, content } = props;
  const titlebarRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titlebarRef.current || !windowRef.current) return;
    if (state.size.width < windowRef.current.offsetWidth) {
      state.size.width = windowRef.current.offsetWidth;
    }

    const dragSettings = makeDraggable(
      titlebarRef.current,
      windowRef.current,
      state
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
      style={`left: ${state.position.x}px; top: ${state.position.y}px; z-index: ${state.position.z};`}
    >
      <div
        ref={titlebarRef}
        class={styles.titlebar}
        style={`cursor: ${state.dragging ? "grabbing" : "grab"};`}
      >
        <div class={styles.title}>{state.title}</div>
        <div class={styles.closeButton} onClick={() => state.close()}></div>
      </div>
      <div
        class={styles.content}
        style={`height: ${state.size.height}px; width: ${state.size.width}px;`}
      >
        {content}
      </div>
    </div>
  );
}
