import DesktopWindow from "./DesktopWindow";
import DesktopWindowState from "./DesktopWindowState";
import styles from "./windows.module.css";

type DesktopWindowsProps = {
  windows: DesktopWindowState[];
  addWindow: (window: DesktopWindowState) => void;
  updateWindow: (window: DesktopWindowState) => void;
};

export default function DesktopWindows(props: DesktopWindowsProps) {
  const { windows, updateWindow } = props;

  return (
    <div class={styles.desktopWindowContainer}>
      {windows.map((window, index) => (
        <DesktopWindow key={window.uuid} state={window} updateState={updateWindow} content={<div>Test</div>} />
      ))}
    </div>
  );
}
