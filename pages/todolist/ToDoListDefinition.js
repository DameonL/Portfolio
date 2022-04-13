import { OrderedIndexedDb } from "./OrderedIndexedDb.js";
import { ToDoItemCard } from "./ToDoItemCard/ToDoItemCard.js";

export function getNewItem() {
    let dueDate = new Date(Date.now());
    dueDate.setMinutes(dueDate.getMinutes() - dueDate.getTimezoneOffset());
    dueDate.setHours(dueDate.getHours() + 1);
    dueDate.setSeconds(0, 0);

    let data = {
        name: "New ToDo Item",
        description: "Insert description here",
        complete: false ,
        dueDate: dueDate.valueOf(),
    }

    return data;
};

export let database = new OrderedIndexedDb("ToDoList", "items", getNewItem);

export let editItem = (data) => {
    if (!data) data = getNewItem();
    let itemCard = new ToDoItemCard(data, () => {
        database.Includes(data) ? database.UpdateItem(data) : database.InsertItemBefore(data, database.GetItemAt(0));
    });
    window.location.hash = "toDoItemCard";
}

let itemDrawHandler = (htmlElement, data) => {
    let currentTime = new Date(Date.now());
    currentTime = currentTime.valueOf() - (currentTime.getTimezoneOffset() * 60000);
    if (!data.complete && data.dueDate < currentTime) {
        htmlElement.style.backgroundColor = "#ffe7e6";
    } else {
        htmlElement.style.backgroundColor = "";
    }

    htmlElement.style.textDecoration = (data.complete) ? "line-through" : "";
}

let itemUpdatedHandler = (data) => { database.UpdateItem(data); }
let itemIndexHandler = (data) => database.GetItemIndex(data);
let itemInsertHandler = (itemToInsert, priorItem) => database.InsertItemBefore(itemToInsert, priorItem);

export let listDefinition = {
    listHtml: `
        <div id="toDoListRender">
        </div>
    `,

    labelHtml: `
        <div class="arrangeableListItem arrangeableListLabel">
            <div class="arrangeableListItemHandle arrangeableListLabelHandle"></div>
            <div class="arrangeableListCheckbox completeCheckBox" boundField="complete" style="text-align: center">◻</div>
            <div class="arrangeableListTextInput nameInputField" boundField="name">Name</div>
            <div class="shortDateTimeField" boundField="dueDate">Due</div>
            <div class="dateTimeInputField" boundfield="dueDate">Due Date</div>
            <div class="arrangeableListTextInput descriptionInputField" boundField="description">Description</div>
            <div class="arrangeableListItemButtons arrangeableListLabelButtons">
                <span title="Create a new item" id="newItemButton" style="cursor: pointer;display: flex;flex-direction: row;justify-content: flex-end;">
                    <div style="position: relative;font-size: 10px;width: 0%;height: 0%;">➕</div>
                    <div>📄</div>
                </span>
            </div>
        </div>
    `,

    listItemHtml: `
        <div class="arrangeableListItem">
            <div class="arrangeableListItemHandle toDoListHandle">⬛️⬛️⬛️</div>
            <input type="checkbox" class="completeCheckbox" boundField="complete">
            <div class="nameInputField" boundField="name" contenteditable="true"></div>
            <div class="shortDateTimeField" boundField="dueDate" dataType="Date" formatFunction="toLocaleDateString"></div>
            <div class="dateTimeInputField"><input type="datetime-local" boundfield="dueDate"></div>
            <div class="descriptionInputField" boundField="description" multiline="true" contenteditable="true">Description</div>
            <div class="arrangeableListItemButtons"></div>
        </div>
    `,

    itemMovementTargetHtml: `<div class="itemMovementTarget"></div>`,

    itemButtonDefinitions: [
        {
            label: `<div title="Edit this item">📝</div>`,
            clickedHandler: editItem,
        },
        {
            label: `<div title="Delete this item">🗑️</div>`,
            clickedHandler: (data) => { if (confirm("Delete this item? This cannot be undone.")) database.DeleteItem(data); }
        },
    ],

    itemUpdatedHandler: itemUpdatedHandler,
    itemDrawHandler: itemDrawHandler,
    itemIndexHandler: itemIndexHandler,
    itemInsertHandler: itemInsertHandler,
}