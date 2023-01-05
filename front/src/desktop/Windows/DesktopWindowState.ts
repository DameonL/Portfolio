export default interface DesktopWindowState {
  title: string;
  uuid?: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
}
