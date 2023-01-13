import DesktopWindow from "../DesktopWindow";
import DesktopWindowState from "../DesktopWindowState";
import Project from "./Project";

export default function ProjectWindow(props: {
  state: DesktopWindowState<Project>;
  windowProps: Project;
}) {
  const { state } = props;
  const { windowProps } = state;

  return (
    <DesktopWindow
      state={state}
      content={
        <div>
          <div>
            {windowProps.links.map((link) => (
              <div>
                <a href={link.link} target="_blank">
                  {link.linkText}
                </a>
              </div>
            ))}
          </div>
          <p>{windowProps.description}</p>
          <p>Technologies:</p>
          <ul>
            {windowProps.technologies.map((technology) => (
              <li>{technology}</li>
            ))}
          </ul>
        </div>
      }
    />
  );
}
