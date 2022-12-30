import { VNode } from "preact";
import DesktopWindowState from "./DesktopWindowState"

interface DesktopWindowProps {
  state: DesktopWindowState,
  content: () => VNode<HTMLDivElement>
}

export default function DesktopWindow(props: DesktopWindowProps) {
  const { state, content } = props;
  return <div class="desktopWindow" style={`left: ${state.position.x}; top: ${state.position.y}; z-index: ${state.position.z}; `}>
    <div class="desktopWindowTitlebar">{state.title}</div>
    <div class="desktopWindowContent">{content}</div>
  </div>
}