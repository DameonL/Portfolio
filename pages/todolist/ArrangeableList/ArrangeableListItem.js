export class ArrangeableListItem {
    #backingData = null;
    #renderRoot = null;
    #listDefinition = null;
    #boundElements = [];
    #buttonRoot = null;
    #allowedDataTypes = [
        "Date",
    ]

    get Index() { return this.#listDefinition.itemIndexHandler(this.#backingData); }

    constructor(backingData, listDefinition) {
        this.#backingData = backingData;
        this.#listDefinition = listDefinition;
        this.#renderRoot = this.#CreateRootNode();
        this.#CreateButtonSpan();
        this.#BindPropertyElements();
        this.#UpdateAppearance();
    }

    get Renderer() {
        return this.#renderRoot;
    }

    #CreateRootNode() {
        let rootNode = document.createRange().createContextualFragment(this.#listDefinition.listItemHtml.trim()).firstChild;
        rootNode.id = "arrangeableListItem" + this.Index;
        rootNode.draggable = true;
        this.#renderRoot = rootNode;

        rootNode.addEventListener("dragstart", (event) => {
            if ((document.activeElement == rootNode) || (document.activeElement.parentNode == rootNode)) {
                event.preventDefault();
                return true;
            }

            event.dataTransfer.setData("text", this.Index);
            event.dataTransfer.effectAllowed = "move";
        });

        return rootNode;
    }
    
    #CreateButtonSpan() {
        this.#buttonRoot = this.#renderRoot.querySelector(".arrangeableListItemButtons");
        this.#listDefinition.itemButtonDefinitions.forEach(definition => {
            let button = document.createElement("span");
            button.innerHTML = definition.label;
            button.style.cursor = "pointer";
            button.addEventListener("click", (event) => { definition.clickedHandler(this.#backingData); });
            this.#buttonRoot.appendChild(button);
        });
    }

    Redraw() {
        this.#UpdateBoundProperties();
        this.#UpdateAppearance();
    }

    #BindPropertyElements() {
        let propertyNames = Object.keys(this.#backingData);
        propertyNames.forEach(property => {
            let boundElements = this.#renderRoot.querySelectorAll(`[boundField="${property}"]`);
            boundElements.forEach(boundElement => {
                this.#boundElements.push(boundElement);

                if ((boundElement.nodeName == "DIV") || (boundElement.nodeName == "SPAN")) {
                    this.#BindTextElement(boundElement, property);
                    this.#AddTextEventListeners(boundElement);
                }
                else if ((boundElement.nodeName == "INPUT") && (boundElement.getAttribute("type") == "checkbox")) {
                    this.#BindCheckboxElement(boundElement, property);
                    boundElement.addEventListener("change", () => {
                        this.#UpdateBackingData();
                    });
                }
                else if ((boundElement.nodeName == "INPUT") && (boundElement.getAttribute("type") == "datetime-local")) {
                    this.#BindDateTimeElement(boundElement, property);
                    boundElement.addEventListener("change", () => {
                        this.#UpdateBackingData();
                    });
                }
            });
        });
    }

    #UpdateBoundProperties() {
        this.#boundElements.forEach(boundElement => {
            let property = boundElement.getAttribute("boundField");
            if ((boundElement.nodeName == "DIV") || (boundElement.nodeName == "SPAN")) {
                this.#BindTextElement(boundElement, property);
            }
            else if ((boundElement.nodeName == "INPUT") && (boundElement.getAttribute("type") == "checkbox")) {
                this.#BindCheckboxElement(boundElement, property);
            }
            else if ((boundElement.nodeName == "INPUT") && (boundElement.getAttribute("type") == "datetime-local")) {
                this.#BindDateTimeElement(boundElement, property);
            }
        });
    }

    #BindTextElement(boundElement, property) {
        let dataType = boundElement.getAttribute("dataType");
        if (this.#allowedDataTypes.includes(dataType)) {
            let newObject = eval(`new ${dataType}(${this.#backingData[property]})`);
            if (dataType == "Date") {
                newObject.setMinutes(newObject.getMinutes() + newObject.getTimezoneOffset());
            }
            let formatFunction = boundElement.getAttribute("formatFunction");
            if (formatFunction) {
                boundElement.innerHTML = newObject[formatFunction]();
            } else {
                boundElement.innerHTML = newObject.toString();
            }
        }
        else {
            boundElement.innerHTML = this.#backingData[property];
        }

    }

    #AddTextEventListeners(boundElement) {
        if (!boundElement.getAttribute("multiLine")) {
            boundElement.addEventListener("keypress", (event) => {
                if (event.key == "Enter") {
                    event.preventDefault();
                    event.target.blur();
                }
            });
        }

        let focusout = () => { this.#UpdateBackingData(); };
        boundElement.addEventListener("focusout", focusout);
    }

    #BindCheckboxElement(boundElement, property) {
        boundElement.checked = this.#backingData[property];
    }

    #BindDateTimeElement(boundElement, property) {
        boundElement.setAttribute("max", "");
        boundElement.valueAsNumber = this.#backingData[property];
    }

    #UpdateBackingData() {
        for (let i = 0; i < this.#boundElements.length; i++) {
            let boundElement = this.#boundElements[i];
            let fieldName = boundElement.getAttribute("boundField");

            if ((boundElement.nodeName == "DIV") || (boundElement.nodeName == "SPAN")) {
                let editable = boundElement.getAttribute("contenteditable");
                if (editable) { this.#backingData[fieldName] = boundElement.innerHTML; }
            } else if ((boundElement.nodeName == "INPUT") && (boundElement.getAttribute("type") == "checkbox")) {
                let disabled = boundElement.getAttribute("disabled");
                if (!disabled) { this.#backingData[fieldName] = boundElement.checked; }
            } else if ((boundElement.nodeName == "INPUT") && (boundElement.getAttribute("type") == "datetime-local")) {
                let disabled = boundElement.getAttribute("disabled");
                if (!disabled) { this.#backingData[fieldName] = boundElement.valueAsNumber; }
            }
        }

        if (this.#listDefinition.itemUpdatedHandler) {
            this.#listDefinition.itemUpdatedHandler(this.#backingData);
        }

        this.#UpdateAppearance();
    }

    #UpdateAppearance() {
        if (this.#listDefinition.itemDrawHandler) {
            this.#listDefinition.itemDrawHandler(this.#renderRoot, this.#backingData);
        }
    }
}