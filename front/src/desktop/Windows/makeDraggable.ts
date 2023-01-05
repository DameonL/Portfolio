import DesktopWindowState from "./DesktopWindowState";

export function makeDraggable(
  handle: HTMLElement,
  target: HTMLElement,
  state: DesktopWindowState,
  updateState: (state: DesktopWindowState) => void
) {
  let dragging = false;
  const startOffset = {
    x: 0,
    y: 0,
  };
  
  return {
    register: () => {
      handle.addEventListener("mousedown", dragStart);
      window.addEventListener("mousemove", dragHandler);
      window.addEventListener("mouseup", dragEnd);
    },

    unregister: () => {
      handle.removeEventListener("mousedown", dragStart);
      window.removeEventListener("mousemove", dragHandler);
      window.removeEventListener("mouseup", dragEnd);
    },
  };

  function dragStart(event: MouseEvent) {
    startOffset.x = event.clientX - target.offsetLeft;
    startOffset.y = event.clientY - target.offsetTop;
    dragging = true;
  }

  function dragHandler(event: MouseEvent) {
    drag(event, state);
  }

  function drag(event: MouseEvent, state: DesktopWindowState) {
    if (!dragging) return;
    state.position.x = event.clientX - startOffset.x;
    state.position.y = event.clientY - startOffset.y;
    updateState(state);
  }

  function dragEnd() {
    if (!dragging) return;

    dragging = false;
  }
}
