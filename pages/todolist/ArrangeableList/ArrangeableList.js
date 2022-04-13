import { ArrangeableListItem } from "./ArrangeableListItem.js";

export class ArrangeableList {
    #rootNode = null;
    #itemData = [];
    #listDefinition = null;
    #sortColumn = "";
    #sortDirection = "asc";
    #listLabel = null;
    #listItems = [];
    #itemMovementDropPoint = null;
    #renderHandlers = [];

    constructor(listDefinition) {
        this.#listDefinition = listDefinition;
        let generatedFragment = document.createRange().createContextualFragment(listDefinition.listHtml.trim());
        let generatedDiv = generatedFragment.firstChild;
        document.body.appendChild(generatedDiv);
        this.#rootNode = generatedDiv;
    }

    get RootNode() { return this.#rootNode; }

    set ItemData(data) {
        this.#itemData = data;
        this.#itemMovementDropPoint = null;
        this.Render();
    }

    get SortColumn() { return this.#sortColumn; }
    set SortColumn(newColumn) { this.#sortColumn = newColumn; }

    IndexOf = (data) => this.#listDefinition.itemIndexHandler(data);

    AddRenderListener(listener) {
        this.#renderHandlers.push(listener);
    }

    RemoveRenderListener(listener) {
        let toRemove = [];
        this.#renderHandlers.forEach(handler => {
            if (handler === listener) {
                toRemove.push(handler);
            }
        });

        toRemove.forEach(handler => {
            this.#renderHandlers.splice(this.#renderHandlers.indexOf(handler), 1);
        });
    }

    CreateListItem(data) {
        let newItem = new ArrangeableListItem(data, this.#listDefinition);
        return newItem;
    }


    RedrawListItem(data) {
        let index = this.#itemData.indexOf(data);
        this.#listItems[index].Redraw();
    }

    Render() {
        this.#listItems.forEach(item => {
            if (item.Renderer.parentNode == this.#rootNode) this.#rootNode.removeChild(item.Renderer);
        });

        if (this.#listLabel && this.#listLabel.parentNode == this.#rootNode) this.#rootNode.removeChild(this.#listLabel);
        if (this.#itemMovementDropPoint && this.#itemMovementDropPoint.parentNode == this.#rootNode) this.#rootNode.removeChild(this.#itemMovementDropPoint);

        this.#listItems = [];

        if (this.#sortColumn != "") {
            this.#itemData.sort((a, b) => this.#SortByDataType(this.#sortColumn, a, b));
        } else {
            this.#itemData.sort((a, b) => {
                return (this.IndexOf(a) > this.IndexOf(b)) ? 1 : -1;
            });
        }

        let itemData = this.#itemData;
        this.#listLabel = this.#CreateLabelDiv();
        this.#rootNode.appendChild(this.#listLabel);

        if (this.#itemMovementDropPoint == null) {
            this.#itemMovementDropPoint = this.#CreateMovementDiv(itemData);
        }

        for (let i = 0; i < itemData.length; i++) {
            let listItem = this.#CreateChildItem(itemData, i, this.#itemMovementDropPoint);
            let renderer = listItem.Renderer;
            if (this.#listDefinition.itemDrawHandler) {
                this.#listDefinition.itemDrawHandler(renderer, itemData[i]);
            }
            if (i % 2 == 1) { renderer.className += " arrangeableListItemAlt"; }

            this.#listItems.push(listItem);
            this.#rootNode.appendChild(renderer);
        }

        this.#renderHandlers.forEach(handler => {
            handler(this.#rootNode);
        });
    }

    #SortByDataType(sortColumn, a, b) {
        let comparison = 0;
        a = a[sortColumn];
        b = b[sortColumn];


        if ((typeof a) == "string") {
            comparison = a.localeCompare(b);
        } else if ((typeof a) == "boolean") {
            if (a == true && b == false) comparison = -1;
            else if (a == false && b == true) comparison = 1;
        } else {
            if (a < b) comparison = -1;
            else if (a > b) comparison = 1;
        }

        if (this.#sortDirection != "asc") comparison = (comparison > 0) ? -comparison : Math.abs(comparison);

        return comparison;
    }

    #CreateLabelDiv() {
        let generatedFragment = document.createRange().createContextualFragment(this.#listDefinition.labelHtml.trim());
        let labelDiv = generatedFragment.firstChild;

        let boundElements = labelDiv.querySelectorAll(`[boundField]`);
        boundElements.forEach(element => {
            let sortColumn = element.getAttribute("boundField");

            let clickedHandler = (event) => {
                if (this.#sortColumn == sortColumn) {
                    if (this.#sortDirection == "desc") { sortColumn = ""; }
                    this.#sortDirection = (this.#sortDirection == "asc") ? "desc" : "asc";
                }

                this.#sortColumn = sortColumn;
                this.Render();
            }

            if (sortColumn == this.#sortColumn) {
                element.innerText += (this.#sortDirection == "asc") ? "⬇" : "⬆";
            }

            element.addEventListener("click", clickedHandler);
        });

        return labelDiv;
    }

    #CreateChildItem(itemData, i, itemMovementDropPoint) {
        let listItem = this.CreateListItem(itemData[i]);
        let renderer = listItem.Renderer;
        let lastY = 0;
        let currentIndex = -1;
        let dragOverHandler = (event) => {
            event.preventDefault();
            let rect = renderer.getBoundingClientRect();
            let deadzone = 5;
            let delta = event.clientY - (rect.top + (rect.height * 0.5));
            if (Math.abs(delta) <= deadzone)
                return;

            let targetIndex = (delta < 0) ? i : i + 1;
            if (currentIndex != targetIndex) {
                itemMovementDropPoint.setAttribute("targetIndex", targetIndex);
                let targetRenderer = undefined;
                if (targetIndex < this.#listItems.length) {
                    targetRenderer = this.#listItems[targetIndex].Renderer;
                }
                this.#rootNode.insertBefore(itemMovementDropPoint, targetRenderer);

                // Trigger animations
                itemMovementDropPoint.className = itemMovementDropPoint.className.replace("arrangeableItemMovementTarget", "");
                itemMovementDropPoint.className += " arrangeableItemMovementTarget";
                currentIndex = targetIndex;
            }

            lastY = event.clientY;
        }

        renderer.addEventListener("dragover", dragOverHandler);

        renderer.addEventListener("dragend", (event) => {
            if (itemMovementDropPoint.parentNode == this.#rootNode) {
                this.#rootNode.removeChild(itemMovementDropPoint);
                currentIndex = -1;
            }
        });
        return listItem;
    }

    #CreateMovementDiv(itemData) {
        let itemMovementDropPoint = document.createRange().createContextualFragment(this.#listDefinition.itemMovementTargetHtml.trim()).firstChild;
        itemMovementDropPoint.addEventListener("drop", (event) => {
            event.preventDefault();
            let droppedIndex = event.dataTransfer.getData("text");
            let targetIndex = itemMovementDropPoint.getAttribute("targetIndex");
            this.#listDefinition.itemInsertHandler(itemData[droppedIndex], itemData[targetIndex]);
        });

        itemMovementDropPoint.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        return itemMovementDropPoint;
    }
}
