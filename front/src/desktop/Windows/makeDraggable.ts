import DesktopWindowState from "./DesktopWindowState";
import constrainToDesktop from "./constrainToDesktop";

export function makeDraggable(
  handle: HTMLElement,
  target: HTMLElement,
  state: DesktopWindowState<any>
) {
  const startOffset = {
    x: 0,
    y: 0,
  };

  constrainToDesktop(state, target);

  const constrain = () => constrainToDesktop(state, target);
  const resizeObserver = new ResizeObserver(constrain);

  return {
    constrainToDesktop: constrain,
    register: () => {
      resizeObserver.observe(target);
      resizeObserver.observe(document.body);
      handle.addEventListener("mousedown", dragStart);
      window.addEventListener("mousemove", dragHandler);
      window.addEventListener("mouseup", dragEnd);
      window.addEventListener("resize", constrain);
    },

    unregister: () => {
      resizeObserver.unobserve(target);
      resizeObserver.unobserve(document.body);
      handle.removeEventListener("mousedown", dragStart);
      window.removeEventListener("mousemove", dragHandler);
      window.removeEventListener("mouseup", dragEnd);
      window.removeEventListener("resize", constrain);
    },
  };

  function dragStart(event: MouseEvent) {
    startOffset.x = event.clientX - target.offsetLeft;
    startOffset.y = event.clientY - target.offsetTop;
    state.dragging = true;
    state.update();
  }

  function dragHandler(event: MouseEvent) {
    drag(event, state);
  }

  function drag(event: MouseEvent, state: DesktopWindowState<any>) {
    if (!state.dragging) return;

    state.position.x = event.clientX - startOffset.x;
    state.position.y = event.clientY - startOffset.y;
    constrainToDesktop(state, target);
    state.update();
  }

  function dragEnd() {
    if (!state.dragging) return;

    state.dragging = false;
    state.update();
  }

}
