import ItemBinder from "./ItemBinder.js";

class ProjectList extends HTMLElement {

    constructor() {
        super();

        this.#fetchProjectData();
    }

   async #fetchProjectData() {
       let projectList = await fetch("./src/ProjectList.json");
       projectList = await projectList.json();
       ItemBinder.bindItemToElement(projectList, this);
   }
}

export default ProjectList;