import { openWindow } from "../../Desktop";
import DesktopWindow from "../DesktopWindow";
import DesktopWindowState from "../DesktopWindowState";
import desktopStyles from "../../desktop.module.css";
import ProjectList from "./Projects";
import Project from "./Project";
import ProjectWindow from "./ProjectWindow";

export default function ProjectsWindow(props: {
  state: DesktopWindowState<any>;
}) {
  return (
    <DesktopWindow
      state={props.state}
      content={
        <div>
          {ProjectList.map((project) => (
            <div
              class={desktopStyles.desktopMenuItem}
              onClick={() => {
                openWindow<Project>(ProjectWindow, project, project.title);
              }}
            >
              {project.title}
            </div>
          ))}
        </div>
      }
    />
  );
}
