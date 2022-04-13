class AtariStWindow extends HTMLElement {
    #contentDiv = null;

    constructor() {
        super();

        let innerElements = [];
        for (let node of this.children) {
            innerElements.push(node);
        }

        setTimeout(() => {
            this.#createWindow(innerElements);
        });

        if (this.hasAttribute("fitContent")) {
            let innerWindow = this.querySelector("[loadFromUrl]");
            let updateToInnerSize = () => {
                this.#contentDiv.firstElementChild.style.width = innerWindow.contentWindow.document.body.scrollWidth + "px";
                this.#contentDiv.firstElementChild.style.height = innerWindow.contentWindow.document.body.scrollHeight + "px";
            }

            let updateSizeInterval = setInterval(updateToInnerSize, 200);
            this.addEventListener("atariWindowClosed", () => { clearInterval(updateSizeInterval); });
        }
    }

    setContent(newContent) {
        this.#contentDiv.innerHtml = "";
        this.#contentDiv.appendChild(newContent);
        this.#loadInnerWindow();
    }

    #loadInnerWindow() {

        let innerWindow = this.querySelector("[loadFromUrl]");
        if (innerWindow) {
            innerWindow.setAttribute("src", innerWindow.getAttribute("loadFromUrl"));
        }
    }

    #createWindow(innerElements) {
        let newWindow = document.querySelector("#atariStWindowTemplate").content.firstElementChild.cloneNode(true);
        newWindow.querySelector(".atariStWindowTitlebarLabel").innerText = this.title;

        this.#contentDiv = newWindow.querySelector(".atariStWindowContent");
        innerElements.forEach(element => {
            this.#contentDiv.appendChild(element);
        });

        let contentWidth = Math.min(600, window.innerWidth * .9);
        let contentHeight = Math.min(600, window.innerHeight * .9);
        this.#contentDiv.style.width = `${contentWidth}px`;
        this.#contentDiv.style.height = `${contentHeight}px`;

        this.appendChild(newWindow);
        this.#setUpWindowDrag(newWindow);
        this.#setUpCloseButton(newWindow);
        this.#loadInnerWindow();
        this.dispatchEvent(new Event("load"));
        return newWindow;
    }    

    #setUpWindowDrag() {
        let dragging = false;
        let startOffsetX = 0;
        let startOffsetY = 0;
    
        let titlebar = this.querySelector(".atariStWindowTitlebar");

        let dragStart = (event) => {
            let x = (event.clientX) ? event.clientX : event.touches[0].clientX;
            let y = (event.clientY) ? event.clientY : event.touches[0].clientY;
            startOffsetX = x - this.offsetLeft;
            startOffsetY = y - this.offsetTop;
            dragging = true;
        }
    
        let dragMove = (event) => {
            if (dragging) {
                let x = (event.clientX) ? event.clientX : event.touches[0].clientX;
                let y = (event.clientY) ? event.clientY : event.touches[0].clientY;
                this.style.left = x - startOffsetX + "px";
                this.style.top = y - startOffsetY + "px";
            }
        }
    
        let dragEnd = (event) => {
            dragging = false;
        }
    
        titlebar.addEventListener("mousedown", dragStart);
        window.addEventListener("mousemove", dragMove);
        window.addEventListener("mouseup", dragEnd);
    
        titlebar.addEventListener("touchstart", dragStart);
        window.addEventListener("touchmove", dragMove);
        window.addEventListener("touchend", dragEnd);
    }
    
    #setUpCloseButton() {
        this.querySelector(".atariStWindowTitlebarClose").addEventListener("click", () => {
            this.dispatchEvent(new Event("atariWindowClosed"));
            this.addEventListener("animationend", () => this.remove());
            this.setAttribute("windowCloseAnimation", "");
        });
    }
}

export default AtariStWindow;