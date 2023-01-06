import { VNode } from "preact";
import desktopStyles from "./desktop.module.css";

interface DesktopIconProps {
  label: string;
  image: VNode<HTMLElement>;
  onClick: () => void;
}

export default function DesktopIcon(props: DesktopIconProps) {
  return (
    <div class={desktopStyles.desktopIcon} onClick={props.onClick}>
      <div class={desktopStyles.desktopIconImage}>{props.image}</div>
      <div class={desktopStyles.desktopIconLabel}>{props.label}</div>
    </div>
  );
}
