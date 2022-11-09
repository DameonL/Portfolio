class OldSchoolWindow extends HTMLElement {
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
    }

    setContent(newContent) {
        this.#contentDiv.innerHtml = "";
        this.#contentDiv.appendChild(newContent);
        this.#loadInnerWindow();
    }

    close() {
        this.dispatchEvent(new Event("oldSchoolWindowClosed"));
        this.addEventListener("animationend", () => this.remove());
        this.setAttribute("windowCloseAnimation", "");
    }

    #loadInnerWindow() {
        let innerWindow = this.querySelector("[loadFromUrl]");
        if (innerWindow) {
            innerWindow.style.resize = "none";
            innerWindow.setAttribute("src", innerWindow.getAttribute("loadFromUrl"));
            innerWindow.addEventListener("load", () => {
                innerWindow.contentWindow.document.querySelector("html").style.overflow = "hidden";
            });

            let updateToInnerSize = () => {
                innerWindow.style.height = `${innerWindow.contentWindow.document.body.scrollHeight}px`;
                innerWindow.style.width = `${innerWindow.contentWindow.document.body.scrollWidth}px`;
            }
    
            let updateSizeInterval = setInterval(updateToInnerSize, 200);
            this.addEventListener("oldSchoolWindowClosed", () => { clearInterval(updateSizeInterval); });
        }
    }

    #createWindow(innerElements) {
        let newWindow = document.querySelector("#oldSchoolWindowTemplate").content.firstElementChild.cloneNode(true);
        newWindow.querySelector(".oldSchoolWindowTitlebarLabel").innerText = this.title;

        this.#contentDiv = newWindow.querySelector(".oldSchoolWindowContent");
        innerElements.forEach(element => {
            this.#contentDiv.appendChild(element);
        });

        let contentWidth = Math.min(600, window.innerWidth * .9) - 30;
        let contentHeight = Math.min(600, window.innerHeight * .9) - 30;
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
    
        let titlebar = this.querySelector(".oldSchoolWindowTitlebar");

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
        this.querySelector(".oldSchoolWindowTitlebarClose").addEventListener("click", () => {
            this.close();
        });
    }
}

export default OldSchoolWindow;
