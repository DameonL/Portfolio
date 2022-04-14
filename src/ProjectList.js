import ItemBinder from "./ItemBinder.js";
import OldSchoolWindow from "./Windows/OldSchoolWindow.js";

class ProjectList extends HTMLElement {
    #projectListBinder = null;

    constructor() {
        super();

        this.#projectListBinder = new ItemBinder();
        this.#fetchProjectData();
    }

    async #fetchProjectData() {
        let projectList = await fetch("./src/ProjectList.json");
        projectList = await projectList.json();
        this.#projectListBinder.bindItemToElement(projectList, this);
        let allProjectLabels = this.querySelectorAll(".oldSchoolWindowContentListItemLabel");
        allProjectLabels.forEach(label => {
            label.addEventListener("click", () => {
                let newWindow = document.createElement("oldSchool-window");
                newWindow.setAttribute("boundField", label.parentElement.getAttribute("boundField"));
                newWindow.setAttribute("boundArrayIndex", label.parentElement.getAttribute("boundArrayIndex"));
                let onload = () => {
                    newWindow.setContent(label.nextElementSibling.content.firstElementChild.cloneNode(true));
                    newWindow.removeEventListener("load", onload);
                    this.#projectListBinder.bindItemToElement(projectList, newWindow);
                }
                newWindow.addEventListener("load", onload);
                document.querySelector("#oldSchoolDesktopItems").appendChild(newWindow);
            });
        });
    }
}

export default ProjectList;
