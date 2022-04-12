import ItemBinder from "./ItemBinder.js";

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
       let allProjectLabels = this.querySelectorAll(".atariStWindowContentListItemLabel");
        allProjectLabels.forEach(label => {
            label.addEventListener("click", () => {
                label.nextElementSibling.style.display = "block";
            });
            label.nextElementSibling.addEventListener("click", (event) => {
                if (event.target.parentElement.nodeName !== "A") {
                    label.nextElementSibling.style.display = "none";
                }
            });
        });
   }
}

export default ProjectList;