import { VNode } from "preact";

export default interface DesktopWindowState<T> {
  type: (props: { state: DesktopWindowState<T>; }) => VNode<HTMLElement>;
  title: string;
  uuid?: string;
  dragging?: boolean;
  position: {
    x: number;
    y: number;
    z: number;
  };
  size: {
    width: number;
    height: number;
  }
  windowProps: T
  close: () => void;
  update: () => void;
}
