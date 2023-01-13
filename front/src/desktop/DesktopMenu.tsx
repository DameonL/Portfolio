import { openWindow } from "./Desktop";
import styles from "./desktop.module.css";
import AboutMeWindow from "./Windows/AboutMeWindow";
import AboutSiteWindow from "./Windows/AboutSiteWindow";

export default function DesktopMenu() {
  return (
    <div class={styles.desktopMenuBar}>
      <div class={styles.desktopMenu}>
        <div class={styles.desktopMenuLabel}>About</div>
        <div class={styles.desktopMenuItems}>
          <div
            class={styles.desktopMenuItem}
            onClick={() => {
              openWindow(AboutMeWindow, { state: null }, "About Me");
            }}
          >
            About Me
          </div>
          <div
            class={styles.desktopMenuItem}
            onClick={() => {
              openWindow(AboutSiteWindow, { state: null }, "About This Site");
            }}
          >
            About This Site
          </div>
        </div>
      </div>
    </div>
  );
}
