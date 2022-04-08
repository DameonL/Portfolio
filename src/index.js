import ProjectList from "./ProjectList.js";

customElements.define("project-list", ProjectList);

setTimeout(() => {
    let elements = document.querySelectorAll(".unloaded");
    let timer = 0;
    elements.forEach(element => {
        setTimeout(() => {
            element.classList.replace("unloaded", "loadIn");
        }, timer);
        timer += 1000;
    });
}, 500);