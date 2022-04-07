class ItemBinder {
    static bindForRead(rootElement) {
        let elementToBind = rootElement;
        let boundElements = elementToBind.querySelectorAll("[boundField]");
        for (let boundElement of boundElements) {
            let fieldPath = boundElement.getAttribute("boundField");
            if (fieldPath.endsWith(".values") || fieldPath.endsWith(".fields")) {
                let fieldAddButtonId = boundElement.getAttribute("fieldAddButton");
                if (boundElement.hasAttribute("fieldAddButton")) {
                    let fieldTemplateId = boundElement.getAttribute("fieldTemplate");
                    let childTemplate = document.querySelector(`#${fieldTemplateId}`).content.firstElementChild;
                    let fieldAddButton = boundElement.parentElement.querySelector(`#${fieldAddButtonId}`);
                    let childList = [];
                    fieldAddButton.addEventListener("click", () => {
                        let newChildItem = childTemplate.cloneNode(true);
                        newChildItem.setAttribute("boundArrayIndex", childList.length);
                        boundElement.appendChild(newChildItem);
                        this.bindForRead(newChildItem);
                        let childBinder = new ItemBinder(newChildItem);
                        childList.push(newChildItem);
                    });
    
                }
            }
        }   
    }

    static bindItemToElement(itemToBind, elementToBind) {
        let boundElements = elementToBind.querySelectorAll("[boundField]");

        for (let boundElement of boundElements.values()) {
            let elementPath = boundElement.getAttribute("boundField").split(".");
            let currentField = itemToBind;
            let currentPath = "";

            let pathIndex;
            for (pathIndex of elementPath) {
                let getArrayIndex = (targetPath, startElement) => {
                    let arrayIndex = 0;
                    let indexElement = startElement;
                    while (indexElement.parentElement && indexElement.getAttribute("boundField") != targetPath) {
                        indexElement = indexElement.parentElement;
                    }
                    arrayIndex = Number(indexElement.getAttribute("boundArrayIndex"));
                    return arrayIndex;
                }

                if (Array.isArray(currentField)) {
                    let arrayIndex = getArrayIndex(currentPath, boundElement);
                    currentField = currentField[arrayIndex];
                }

                if (!currentField) break;
                currentField = currentField[pathIndex];
                if (currentPath != "") currentPath += ".";
                currentPath += pathIndex;
            }

            if (boundElement.hasAttribute("bindFieldName")) {
                boundElement.innerText = elementPath[elementPath.length - 1];
                boundElement.innerText = `${boundElement.innerText[0].toUpperCase()}${boundElement.innerText.substring(1)}`;
            } else if (Array.isArray(currentField)) {
                if (boundElement.getAttribute("fieldtemplate"))
                {
                    let childTemplate = document.querySelector(`#${boundElement.getAttribute("fieldtemplate")}`).content.firstElementChild;
                    for (let arrayIndex in currentField) {
                        let childElement = childTemplate.cloneNode(true);
                        childElement.setAttribute("boundArrayIndex", arrayIndex);
                        boundElement.appendChild(childElement);
                        this.bindForRead(childElement);
                        this.bindItemToElement(itemToBind, childElement);
                        if (boundElement.getAttribute("arrayRenderType") === "first") break;
                    }
                }
            } else {
                if ((boundElement.nodeName == "DIV") || (boundElement.nodeName == "SPAN") || (boundElement.nodeName == "TITLE") || (boundElement.nodeName == "LI")) {
                    if (pathIndex == "fields") {
                        let templateId = boundElement.getAttribute("fieldtemplate");
                        if (templateId) {
                            while (boundElement.firstElementChild) boundElement.firstElementChild.remove();
                            let mapTemplate = document.querySelector(`#${templateId}`).content.firstElementChild;
                            
                            let mapFields = Object.keys(currentField);
                            mapFields.sort();
                            for (let mapFieldIndex of mapFields) {
                                let mapField = currentField[mapFieldIndex];
                                let childField = Object.keys(mapField)[0];
                                let pathAppend = `${mapFieldIndex}.${childField}`;
                                let clone = mapTemplate.cloneNode(true);
                                let cloneFieldNodes = clone.querySelectorAll(`[boundField="${currentPath}"]`);
                                for (let node of cloneFieldNodes.values()) {
                                    node.setAttribute("boundField", `${currentPath}.${pathAppend}`);
                                }
                                boundElement.appendChild(clone);
                                this.bindItemToElement(itemToBind, clone, productId);
                            }

                        }
                    } else {
                        boundElement.innerText = currentField;
                    }
                } else if (boundElement.hasAttribute("boundAttribute")) {
                    boundElement.setAttribute(boundElement.getAttribute("boundAttribute"), currentField);
                } else if (boundElement.nodeName === "IMG") {
                    // TODO: Image handling?
                }
            }
        }
    }

    static getItemFromElement(rootElement) {
        let boundElements = rootElement.querySelectorAll("[boundField]");
        let composedItem = {};

        for (let boundElement of boundElements.values()) {
            let elementPath = boundElement.getAttribute("boundField").split(".");
            let currentField = composedItem;
            let currentPath = "";

            for (let pathIndex of elementPath) {
                if (currentPath != "") currentPath += ".";
                currentPath += pathIndex;

                if (Array.isArray(currentField[pathIndex])) {
                    let arrayIndex = 0;
                    let indexElement = boundElement;
                    while (indexElement.parentElement.getAttribute("boundField") != currentPath) {
                        indexElement = indexElement.parentElement;
                    }
                    arrayIndex = Number(indexElement.getAttribute("boundArrayIndex"));

                    currentField = currentField[pathIndex];
                    pathIndex = arrayIndex;
                }

                if (!currentField[pathIndex]) {
                    let pathItem = null;
                    if (pathIndex === "values") {
                        pathItem = [];
                    } else if ((pathIndex === "stringValue") || (pathIndex === "doubleValue") || (pathIndex === "integerValue")) {
                        currentField[pathIndex] = boundElement.value;
                        break;
                    } else {
                        pathItem = {};
                    }

                    currentField[pathIndex] = pathItem;
                    currentField = pathItem;
                } else {
                    currentField = currentField[pathIndex];
                }

            }

        }
        return composedItem;
    }
}

export default ItemBinder;