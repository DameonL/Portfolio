import DesktopWindow from "./DesktopWindow";
import DesktopWindowState from "./DesktopWindowState";

export default function AboutMeWindow(props: { state: DesktopWindowState<null> }) {
  const size = props.state.size;
  size.width = 600;
  return (
    <DesktopWindow
      state={props.state}
      content={
        <div>
          <div>Dameon Laird</div>
          <div>Languages:</div>
          <ul>
            <li>C#</li>
            <li>TypeScript</li>
            <li>JavaScript/HTML/CSS</li>
            <li>Java</li>
            <li>C</li>
            <li>Visual Basic</li>
          </ul>
          <div>Technologies:</div>
          <ul>
            <li>.NET/.NET Core/ASP.NET</li>
            <li>React</li>
            <li>Node</li>
            <li>Unity</li>
            <li>Visual Studio</li>
            <li>Microsoft Azure</li>
            <li>Google Cloud Platform</li>
          </ul>
        </div>
      }
    />
  );
}
