import { VNode } from "preact";

export default interface DesktopWindowState {
  type: (props: { state: DesktopWindowState; }) => VNode<HTMLElement>;
  title: string;
  uuid?: string;
  dragging?: boolean;
  position: {
    x: number;
    y: number;
    z: number;
  };
  size: {
    width: number | "auto";
    height: number | "auto";
  }
  close: () => void;
  update: () => void;
}
