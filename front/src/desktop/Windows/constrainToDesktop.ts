import { desktop } from "../Desktop";
import DesktopWindowState from "./DesktopWindowState";

export default function constrainToDesktop(
  state: DesktopWindowState<any>,
  target: HTMLElement
) {
  let targetRect = target.getBoundingClientRect();
  let desktopRect = desktop.current.getBoundingClientRect();
  if (state.position.x < 0 || state.position.x > desktopRect.right) {
    state.position.x = 0;
  }

  if (state.position.y < 0 || state.position.y > desktopRect.bottom) {
    state.position.y = 0;
  }

  if (targetRect.right > desktopRect.right) {
    state.size.width -= targetRect.right - desktopRect.right;
  }

  if (targetRect.bottom > desktopRect.bottom) {
    state.size.height -= targetRect.bottom - desktopRect.bottom;
  }

  state.update();
}
