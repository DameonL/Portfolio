import { openWindow } from "./Desktop";
import styles from "./desktop.module.css";
import AboutWindow from "./Windows/AboutWindow";

export default function DesktopMenu() {
  return (
    <div class={styles.desktopMenuBar}>
      <div class={styles.desktopMenu}>
        <div class={styles.desktopMenuLabel}>About</div>
        <div class={styles.desktopMenuItems}>
          <div
            class={styles.desktopMenuItem}
            onClick={() => {
              openWindow(AboutWindow, "About Me");
            }}
          >
            About Me
          </div>
        </div>
      </div>
    </div>
  );
}
