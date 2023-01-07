import DesktopWindow from "../DesktopWindow";
import DesktopWindowState from "../DesktopWindowState";
import Sample from "./Sample";

export default function SampleWindow(props: {
  state: DesktopWindowState<Sample>;
  windowProps: Sample;
}) {
  const { state } = props;
  const { windowProps } = state;

  return (
    <DesktopWindow
      state={state}
      content={
        <div>
          <div>
            <a href={windowProps.link} target="_blank">
              Open in New Window
            </a>
          </div>
          {windowProps.github && (
            <div>
              <a href={windowProps.github} target="_blank">
                Source Code
              </a>
            </div>
          )}
          <p>{windowProps.description}</p>
          <p>Technologies:</p>
          <div>{windowProps.technologies}</div>
        </div>
      }
    />
  );
}
