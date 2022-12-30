import DesktopWindow from "./DesktopWindow";
import DesktopWindowState from "./DesktopWindowState";

type DesktopWindowsProps = {
  windows: DesktopWindowState[];
  addWindow: (window: DesktopWindowState) => void;
};

export default function DesktopWindows(props: DesktopWindowsProps) {
  const { windows } = props;

  return (
    <div>
      {windows.map((window) => (
        <DesktopWindow state={window} content={<div>Test</div>} />
      ))}
    </div>
  );
}
