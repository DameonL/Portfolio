import { openWindow } from "../../Desktop";
import DesktopWindow from "../DesktopWindow";
import DesktopWindowState from "../DesktopWindowState";
import Sample from "./Sample";
import Samples from "./Samples";
import SampleWindow from "./SampleWindow";
import desktopStyles from "../../desktop.module.css";

export default function SamplesWindow(props: {
  state: DesktopWindowState<any>;
}) {

  return (
    <DesktopWindow
      state={props.state}
      content={
        <div>
          {Samples.map((sample) => (
            <div>
              <div
                class={desktopStyles.desktopMenuItem}
                onClick={() => {
                  openWindow<Sample>(SampleWindow, sample, sample.label);
                }}
              >
                {sample.label}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}
