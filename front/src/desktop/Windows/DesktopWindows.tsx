import DesktopWindowState from "./DesktopWindowState";
import styles from "./windows.module.css";

type DesktopWindowsProps = {
  windows: DesktopWindowState[];
};

export default function DesktopWindows(props: DesktopWindowsProps) {
  const { windows } = props;

  return (
    <div class={styles.desktopWindowContainer}>
      {windows.map((window, index) => (
        <window.type key={window.uuid} state={window} />
      ))}
    </div>
  );
}
