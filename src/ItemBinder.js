class ItemBinder {
    bindForRead(rootElement) {
        // TODO: This code will need to be completely redone
        let elementToBind = rootElement;
        let boundElements = elementToBind.querySelectorAll("[boundField]");
        for (let boundElement of boundElements) {
            let fieldPath = boundElement.getAttribute("boundField");
            if (boundElement.getAttribute("fieldTemplate")) {
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

    bindItemToElement(itemToBind, elementToBind) {
        let boundElements = elementToBind.querySelectorAll("[boundField]");

        for (let boundElement of boundElements.values()) {
            const currentField = this.#getFieldFromPath(itemToBind, boundElement);

            if (boundElement.hasAttribute("bindFieldName")) {
                const pathEndRegex = /(?<=.)\w*$/;
                boundElement.innerText = pathEndRegex.exec(boundElement.getAttribute("boundField"));
                boundElement.innerText = `${boundElement.innerText[0].toUpperCase()}${boundElement.innerText.substring(1)}`;
            } else if (boundElement.hasAttribute("boundAttribute")) {
                boundElement.setAttribute(boundElement.getAttribute("boundAttribute"), currentField);
            } else if ((Array.isArray(currentField)) && (boundElement.getAttribute("fieldtemplate"))) {
                this.#bindArrayElement(currentField, itemToBind, boundElement);
            } else {
                boundElement.innerText = currentField;
            }
        }
    }

    #bindArrayElement(fieldToBind, itemToBind, elementToBind) {
        let childTemplate = document.querySelector(`#${elementToBind.getAttribute("fieldtemplate")}`).content.firstElementChild;
        for (let arrayIndex in fieldToBind) {
            let childElement = childTemplate.cloneNode(true);
            childElement.setAttribute("boundArrayIndex", arrayIndex);
            elementToBind.appendChild(childElement);
            this.bindItemToElement(itemToBind, childElement);
            if (elementToBind.getAttribute("arrayRenderType") === "first") break;
        }
    }

    getItemFromElement(rootElement) {
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

    #getArrayIndex(targetPath, startElement) {
        let arrayIndex = 0;
        let indexElement = startElement;
        while (indexElement.parentElement && indexElement.getAttribute("boundField") != targetPath) {
            indexElement = indexElement.parentElement;
        }
        arrayIndex = Number(indexElement.getAttribute("boundArrayIndex"));
        return arrayIndex;
    }

    #getFieldFromPath(fieldObjectRoot, boundElement) {
        let elementPath = boundElement.getAttribute("boundField").split(".");
        let currentPath = "";
        let currentField = fieldObjectRoot;
        for (let pathIndex of elementPath) {
            if (Array.isArray(currentField)) {
                const arrayIndex = this.#getArrayIndex(currentPath, boundElement);
                currentField = currentField[arrayIndex];
            }

            if (!currentField) break;
            currentField = currentField[pathIndex];
            if (currentPath != "") currentPath += ".";
            currentPath += pathIndex;
        }

        return currentField;
    }

}

export default ItemBinder;