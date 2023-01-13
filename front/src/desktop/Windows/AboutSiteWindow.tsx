import DesktopWindow from "./DesktopWindow";
import DesktopWindowState from "./DesktopWindowState";

export default function AboutSiteWindow(props: { state: DesktopWindowState<null> }) {
  const size = props.state.size;
  size.width = 600;
  return (
    <DesktopWindow
      state={props.state}
      content={
        <div>
          <div>This portfolio site is inspired by the Atari ST, and makes use of the following technologies:</div>
          <ul>
            <li>ReactJS</li>
            <li>TypeScript</li>
            <li>JavaScript/HTML/CSS</li>
            <li>NodeJS</li>
          </ul>
          <a href="https://github.com/DameonL/Portfolio" target="_blank">View My Source!</a>
        </div>
      }
    />
  );
}
