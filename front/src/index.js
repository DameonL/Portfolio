import { render } from "preact";
import Main from "./Main";

const root = document.createElement("div", { id: "root" });
document.body.appendChild(root);
render(Main(), root);

console.log("Rendered");
