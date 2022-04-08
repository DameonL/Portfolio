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
   }
}

export default ProjectList;