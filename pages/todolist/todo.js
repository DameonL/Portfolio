import { ArrangeableList } from "./ArrangeableList/ArrangeableList.js";
import { listDefinition, database, editItem } from "./ToDoListDefinition.js";


if (!('indexedDB' in window)) {
    document.getRootNode().innerHTML = "Sorry, your browser does not support indexedDB";
} else {
    let toDoList = new ArrangeableList(listDefinition);
    document.querySelector("#renderTarget").appendChild(toDoList.RootNode);
    
    database.AddListChangedHandler((newListData) => {
        toDoList.ItemData = newListData;
    });

    database.AddItemChangedHandler((changedData) => {
        
        toDoList.RedrawListItem(changedData);
    })
    
    toDoList.AddRenderListener(rootNode => {
        let addButton = rootNode.querySelector("#newItemButton");
        if (addButton) {
            addButton.addEventListener("click", () => {
                editItem();
            });
        }
    });
    toDoList.ItemData = database.Items;
}

