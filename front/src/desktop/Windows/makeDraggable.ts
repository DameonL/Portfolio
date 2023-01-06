import DesktopWindowState from "./DesktopWindowState";
import { desktop } from "../Desktop";

export function makeDraggable(
  handle: HTMLElement,
  target: HTMLElement,
  state: DesktopWindowState,
) {
  const startOffset = {
    x: 0,
    y: 0,
  };

  constrainToWindow();
  
  const resizeObserver = new ResizeObserver(targetResized);

  return {
    register: () => {
      resizeObserver.observe(target);
      resizeObserver.observe(document.body);
      handle.addEventListener("mousedown", dragStart);
      window.addEventListener("mousemove", dragHandler);
      window.addEventListener("mouseup", dragEnd);
    },

    unregister: () => {
      resizeObserver.unobserve(target);
      resizeObserver.unobserve(document.body);
      handle.removeEventListener("mousedown", dragStart);
      window.removeEventListener("mousemove", dragHandler);
      window.removeEventListener("mouseup", dragEnd);
    },
  };

  function targetResized() {
    constrainToWindow();
    state.update()
  }

  function dragStart(event: MouseEvent) {
    startOffset.x = event.clientX - target.offsetLeft;
    startOffset.y = event.clientY - target.offsetTop;
    state.dragging = true;
    state.update()
  }

  function dragHandler(event: MouseEvent) {
    drag(event, state);
  }

  function drag(event: MouseEvent, state: DesktopWindowState) {
    if (!state.dragging) return;
    state.position.x = event.clientX - startOffset.x;
    state.position.y = event.clientY - startOffset.y;
    constrainToWindow();
    state.update()
  }

  function dragEnd() {
    if (!state.dragging) return;

    state.dragging = false;
    state.update()
  }

  function constrainToWindow() {
    const desktopSize = { x: desktop.current.offsetLeft, y: desktop.current.offsetTop, width: desktop.current.offsetWidth, height: desktop.current.offsetHeight }
    const position = state.position;
    const min = { x: desktopSize.x, y: desktopSize.y, z: 0 };
    const max = {
      x: target.offsetWidth < desktopSize.width ? desktopSize.width - target.offsetWidth : desktopSize.width,
      y: target.offsetHeight < desktopSize.height ? desktopSize.height - target.offsetHeight : desktopSize.height,
    };

    max.y -= 15;

    for (const property in position) {
      if (position[property] < min[property]) {
        position[property] = min[property];
      }

      if (position[property] > max[property]) {
        position[property] = max[property];
      }
    }

    const width = state.size.width === "auto" ? target.offsetWidth : state.size.width;
    const height = state.size.height === "auto" ? target.offsetHeight : state.size.height;

    if (width + position.x > desktopSize.width) {
      state.size.width = desktopSize.width - position.x;
    }

    if (height + position.y > desktopSize.height) {
      state.size.height = desktopSize.height - position.y;
    }

  }
}
