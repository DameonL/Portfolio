export class TextEditor {
    #rootNode = null;
    #editorNode = null;
    #toolBarNode = null;
    #editingText = "";
    #parentElement = null;
    #saveHandlers = [];
    #lastFocusedField = null;
    #lastFocusedFieldPosition = -1;
    #editorHTML = null;

    get EditorText() { return this.#editorNode.innerHTML; }
    set EditorText(newText) {
        this.#editingText = newText;
        this.#editorNode.innerHTML = newText;
        let checkboxes = this.#editorNode.querySelectorAll(`input[type="checkbox"]`);
        checkboxes.forEach(checkbox => this.#AddCheckBoxListener(checkbox));
    }

    get Enabled() { return this.#editorNode.getAttribute("contenteditable") == true; }
    set Enabled(newValue) { this.#editorNode.setAttribute("contenteditable", newValue == true); }

    constructor(loadedHandler) {
        fetch("./TextEditor/TextEditor.html").then(response => {
            return response.text();
        }).then(text => {
            this.#editorHTML = text;
            this.Render();
            loadedHandler();
        });
    }

    Render() {
        this.#rootNode = document.createRange().createContextualFragment(this.#editorHTML.trim()).firstChild;
        this.#editorNode = this.#rootNode.querySelector(`.editorTarget`);
        this.#editorNode.addEventListener("focusout", (event) => this.#RememberSelection(event));
        this.#lastFocusedField = this.#editorNode;
        this.#lastFocusedFieldPosition = 0;
        this.#InitializeToolBar();
        this.#InitializeEditorField();
    }

    AttachTo(targetNode) {
        targetNode.appendChild(this.#rootNode);
    }


    #InitializeEditorField() {
        let boundElement = this.#editorNode;
        boundElement.addEventListener("keypress", (event) => { if (event.key == "Enter") this.#EnterKeyHandler(event); });
        boundElement.addEventListener("keydown", (event) => { if (event.key == "Backspace") this.#BackspaceHandler(event); });
    }

    #EnterKeyHandler(event) {
        let selection = document.getSelection();
        if (selection.anchorNode != undefined) {
            let listNode = selection.anchorNode;
            while (listNode && listNode.nodeName != "LI") listNode = listNode.parentElement;

            if (!listNode) return true;

            if ((listNode.firstChild) && (listNode.firstChild.nodeName == "INPUT") && (listNode.firstChild.type == "checkbox")) {
                if (listNode.innerText.trim() == "") {
                    let afterDiv = document.createElement("div");
                    afterDiv.innerHTML = "&nbsp;";
                    listNode.parentElement.after(afterDiv);
                    listNode.parentElement.removeChild(listNode);
                    selection.collapse(afterDiv, 1);
                    event.preventDefault();
                    return false;
                }

                let newCheckbox = this.#CreateCheckmarkListItem();
                listNode.after(newCheckbox);
                selection.collapse(newCheckbox, 1);
                event.preventDefault();
                return false;
            }
        }
    }

    #BackspaceHandler(event) {
        let selection = document.getSelection();
        let selectionRange = selection.getRangeAt(0);
        if ((selectionRange.startOffset == 1) && (selectionRange.startContainer.nodeName == "LI") && (selectionRange.startContainer.firstChild.type == "checkbox")) {
            selection.modify("move", "left", "word");
            selectionRange.startContainer.parentElement.removeChild(selectionRange.startContainer);
            event.preventDefault();
            return false;
        }

        let anchorNode = document.getSelection().anchorNode;
        if (anchorNode != undefined && anchorNode.previousSibling == null && anchorNode.parentElement.nodeName == "UL") {
            event.preventDefault();
            anchorNode.parentElement.parentElement.removeChild(anchorNode.parentElement);
            return false;
        }
    };

    #AddCheckBoxListener(checkbox) {
        checkbox.addEventListener("change", (event) => {
            if (checkbox.checked) { checkbox.setAttribute("checked", ""); }
            else { checkbox.removeAttribute("checked"); }
        });
    }

    #InitializeToolBar() {
        let insertListButton = this.#rootNode.querySelector("#insertList");
        insertListButton.addEventListener("click", (event) => this.#InsertList(event));

        let insertCheckListButton = this.#rootNode.querySelector("#insertCheckList");
        insertCheckListButton.addEventListener("click", (event) => this.#InsertCheckList(event));

        let listStyleDropdown = this.#rootNode.querySelector("#listTypeSelector");
        listStyleDropdown.addEventListener("change", (event) => this.#ToolBarListStyleChanged(event));

        let fontColorButton = this.#rootNode.querySelector("#fontColorSelector");
        fontColorButton.addEventListener("input", (event) => this.#ChangeFontColor(event));

        let bgColorButton = this.#rootNode.querySelector("#bgColorSelector");
        bgColorButton.addEventListener("input", (event) => this.#ChangeBgColor(event));

        let fontSizeDropdown = this.#rootNode.querySelector("#fontSizeSelector");
        fontSizeDropdown.addEventListener("change", (event) => {
            this.#ChangeFontSize(event);
            fontSizeDropdown.blur();
        });
        fontSizeDropdown.addEventListener("blur", (event) => fontSizeDropdown.selectedIndex = -1);

        let fontWeightDropdown = this.#rootNode.querySelector("#fontWeightDropdown");
        fontWeightDropdown.addEventListener("change", (event) => {
            this.#ChangeFontWeight(event);
        });

        this.#toolBarNode = this.#rootNode.querySelector(".textEditorToolBar");

        let italicButton = this.#rootNode.querySelector("#italicButton");
        italicButton.addEventListener("click", (event) => this.#ChangeFontStyle(event));
    }

    #ToolBarListStyleChanged(event) {
        let targetList = this.#GetParentList(this.#lastFocusedField);
        let listStyleDropdown = this.#rootNode.querySelector("#listTypeSelector");
        let insertListButtonList = this.#rootNode.querySelector("#insertList > ul");
        let insertCheckListButtonList = this.#rootNode.querySelector("#insertCheckList > ul");
        let selectedStyle = listStyleDropdown.options[listStyleDropdown.selectedIndex].value;

        insertListButtonList.style.listStyle = selectedStyle;
        insertCheckListButtonList.style.listStyle = selectedStyle;

        if (targetList) {
            targetList.style.listStyle = selectedStyle;
        }
    }

    #GetParentList(targetList) {
        while (targetList && targetList.nodeName != "UL" && targetList.nodeName != "OL") {
            targetList = targetList.parentNode;
        }
        return targetList;
    }

    #InsertCheckList() {
        let listElement = document.createElement("ul");
        let defaultItem = this.#CreateCheckmarkListItem();
        listElement.appendChild(defaultItem);
        let textNode = document.createTextNode("My new check item");
        defaultItem.appendChild(textNode);
        this.#InsertNode(listElement);
        document.getSelection().collapse(textNode, textNode.length);
    }

    #CreateCheckmarkListItem() {
        let defaultItem = document.createElement("li");
        defaultItem.className = "checkList";
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        this.#AddCheckBoxListener(checkbox);
        defaultItem.appendChild(checkbox);
        return defaultItem;
    }

    #InsertList() {
        let listElement = document.createElement("ul");
        let defaultItem = document.createElement("li");
        defaultItem.innerHTML = "My new list item";
        listElement.appendChild(defaultItem);
        this.#InsertNode(listElement);
    }

    #InsertNode(nodeToInsert) {
        let listStyleDropdown = this.#rootNode.querySelector("#listTypeSelector");
        nodeToInsert.style.listStyle = listStyleDropdown.options[listStyleDropdown.selectedIndex].value;
        if (this.#lastFocusedField.nodeName == "#text") {
            let content = this.#lastFocusedField.textContent;
            let text1 = content.substring(0, this.#lastFocusedFieldPosition);
            let text2 = content.substring(this.#lastFocusedFieldPosition, content.length);
            this.#lastFocusedField.textContent = text1;
            let newTextNode = document.createTextNode(text2);
            this.#lastFocusedField.after(nodeToInsert);
            nodeToInsert.after(newTextNode);
        }
        else {
            if (this.#lastFocusedField == this.#editorNode) {
                this.#editorNode.appendChild(nodeToInsert);
            } else {
                this.#lastFocusedField.after(nodeToInsert);
            }
        }

        document.getSelection().collapse(nodeToInsert, 1);
    }

    #ChangeSelectionStyle(styleChangeCallback) {
        let selection = document.getSelection();
        let range = selection.getRangeAt(0);
        if ((range.startContainer === range.endContainer) && (range.startOffset == range.endOffset)) { return; }

        this.#adjustRangeBoundaries(range);

        let contents = range.extractContents();
        contents.childNodes.forEach(child => {
            this.#AddOrChangeStyleSpan(child, styleChangeCallback);
        });

        range.insertNode(contents);
    }

    #AddOrChangeStyleSpan(child, styleChangeCallback) {
        let elementToChange = null;
        if (!(child instanceof Text) && child.classList.contains("textEditorFormatSpan")) {
            elementToChange = child;
        } else {
            let styleSpan = document.createElement("span");
            styleSpan.classList.add("textEditorFormatSpan");
            child.parentNode.replaceChild(styleSpan, child);
            styleSpan.appendChild(child);
            elementToChange = styleSpan;
        }

        styleChangeCallback(elementToChange);
        if (elementToChange.getAttribute("style") == "") {
            let parentNode = elementToChange.parentNode;
            elementToChange.childNodes.forEach(child => {
                elementToChange.before(child);
            });
            parentNode.removeChild(elementToChange);
        }
    }

    #adjustRangeBoundaries(range) {
        let containerLength = (container) => {
            return (container instanceof Text) ? container.length : container.childNodes.length;
        }

        while ((range.startOffset == 0) && (range.startContainer !== range.commonAncestorContainer)) {
            let offset = this.#getOffset(range.startContainer, range.startContainer.parentNode.childNodes);
            range.setStart(range.startContainer.parentNode, offset);
        }

        while ((range.startOffset == containerLength(range.startContainer))
            && (range.startContainer !== range.commonAncestorContainer)) {
            let offset = this.#getOffset(range.startContainer, range.startContainer.parentNode.childNodes);
            range.setStart(range.startContainer.parentNode, offset);
        }

        while ((range.endOffset == 0) && (range.endContainer !== range.commonAncestorContainer)) {
            let offset = this.#getOffset(range.endContainer, range.endContainer.parentNode.childNodes);
            range.setEnd(range.endContainer.parentNode, offset + 1);
        }

        while ((range.endOffset == containerLength(range.endContainer))
            && (range.endContainer !== range.commonAncestorContainer)) {
            let offset = this.#getOffset(range.endContainer, range.endContainer.parentNode.childNodes);
            range.setEnd(range.endContainer.parentNode, offset + 1);
        }
    }

    #getOffset() {
        return (node, nodeList) => {
            let offset = 0;
            for (; offset < nodeList.length; offset++) {
                if (nodeList[offset] === node) {
                    break;
                }
            }

            return offset;
        };
    }

    #ChangeFontColor(event) {
        let fontColorButton = this.#rootNode.querySelector("#fontColorSelector");
        let fontDisplay = fontColorButton.nextSibling.parentElement;
        let fontColor = fontColorButton.value;
        fontDisplay.style.color = fontColor;
        let callBack = (fontColor == "#000000") ?
            (element) => element.style.setProperty("color", null)
            : (element) => element.style.setProperty("color", fontColor, "important");

        this.#ChangeSelectionStyle(callBack);
    }

    #ChangeBgColor(event) {
        let bgColorButton = this.#rootNode.querySelector("#bgColorSelector");
        let bgDisplay = bgColorButton.nextSibling.parentElement;
        let bgColor = bgColorButton.value;
        bgDisplay.style.backgroundColor = bgColor;
        let callBack = (bgColor == "#ffffff") ?
            (element) => element.style.setProperty("background-color", null)
            : (element) => element.style.setProperty("background-color", bgColor, "important");

        this.#ChangeSelectionStyle(callBack);
    }

    #ChangeFontSize(event) {
        let fontSizeDropdown = this.#rootNode.querySelector("#fontSizeSelector");
        let fontSize = fontSizeDropdown.options[fontSizeDropdown.selectedIndex].value;
        let fontSizePlaceholder = fontSizeDropdown.querySelector("#fontSizePlaceholder");
        fontSizePlaceholder.innerText = fontSize.replace("px", "");

        let callBack = null;
        if ((fontSize == "+") || (fontSize == "-")) {
            callBack = (element) => {
                let currentSize = element.style.fontSize;
                if (currentSize == "") {
                    let computedStyle = window.getComputedStyle(element);
                    currentSize = computedStyle.getPropertyValue("font-size");
                    if (currentSize == "")
                        currentSize = "16px";
                }

                currentSize = Number(currentSize.replace("px", ""));
                if (fontSize == "+") currentSize++;
                else currentSize--;

                element.style.setProperty("font-size", `${currentSize}px`, "important");
            }
        }
        else {
            callBack = (fontSize == "16px") ?
                (element) => element.style.setProperty("font-size", null)
                : (element) => element.style.setProperty("font-size", fontSize, "important");
        }
        this.#ChangeSelectionStyle(callBack);
    }

    #ChangeFontWeight(event) {
        let fontweightDropdown = this.#rootNode.querySelector("#fontWeightDropdown");
        let fontWeight = fontweightDropdown.options[fontweightDropdown.selectedIndex].value;

        let callBack = null;
        callBack = (fontWeight == "0") ?
            (element) => { element.style.setProperty("font-weight", null); fontWeightDropdown.style.setProperty("font-weight", null); }
            : (element) => { element.style.setProperty("font-weight", fontWeight, "important"); fontWeightDropdown.style.setProperty("font-weight", fontWeight, "important"); }

        this.#ChangeSelectionStyle(callBack);
    }

    #ChangeFontStyle(event) {
        let italicButton = this.#rootNode.querySelector("#italicButton");

        this.#ChangeSelectionStyle((element) => {
            if (element.style.fontStyle == "italic") {
                element.style.setProperty("font-style", null);
            }
            else {
                element.style.setProperty("font-style", "italic", "important");
            }
        });
    }

    #RememberSelection(event) {
        let selection = document.getSelection();
        this.#lastFocusedField = selection.focusNode;
        this.#lastFocusedFieldPosition = selection.focusOffset;
    }
}