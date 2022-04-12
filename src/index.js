import ProjectList from "./ProjectList.js";
customElements.define("project-list", ProjectList);

function createWindow(labelText, htmlContent) {
    let newWindow = document.querySelector("#atariStWindowTemplate").content.firstElementChild.cloneNode(true);
    newWindow.querySelector("atariStWindowTitlebarLabel").innerText = labelText;

}

function setUpWindowDrag(titlebar, newWindow) {
    let dragging = false;
    let startOffsetX = 0;
    let startOffsetY = 0;

    let dragStart = (event) => {
        let x = (event.clientX) ? event.clientX : event.touches[0].clientX;
        let y = (event.clientY) ? event.clientY : event.touches[0].clientY;
        startOffsetX = x - newWindow.offsetLeft;
        startOffsetY = y - newWindow.offsetTop;
        dragging = true;
    }

    let dragMove = (event) => {
        if (dragging) {
            let x = (event.clientX) ? event.clientX : event.touches[0].clientX;
            let y = (event.clientY) ? event.clientY : event.touches[0].clientY;
            newWindow.style.left = x - startOffsetX + "px";
            newWindow.style.top = y - startOffsetY + "px";
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

function setUpCloseButton(closeButton, newWindow) {

}

document.querySelectorAll(".atariStDesktopItem").forEach(element => {
    element.addEventListener("click", () => {
        let newWindow = element.querySelector(".atariStWindowTemplate").content.firstElementChild.cloneNode(true);
        newWindow.style.display = "block";
        
        document.querySelector("#atariStDesktopItems").appendChild(newWindow);

        let innerWindow = newWindow.querySelector("[loadFromUrl]");
        if (innerWindow) {
            newWindow.querySelector(".atariStWindowContent").style.overflow = "hidden";
            innerWindow.setAttribute("src", innerWindow.getAttribute("loadFromUrl"));
        }

        newWindow.querySelector(".atariStWindowTitlebarClose").addEventListener("click", () => {
            newWindow.addEventListener("animationend", () => newWindow.remove());
            newWindow.setAttribute("windowCloseAnimation", "");
        });

        let titlebar = newWindow.querySelector(".atariStWindowTitlebar");
        setUpWindowDrag(titlebar, newWindow);

        setTimeout(() => {
            newWindow.querySelectorAll(".atariStWindowContentListItemLabel").forEach(element => {
                element.addEventListener("click", () => {
                    element.nextElementSibling.style.display = "block";
                });
                element.nextElementSibling.addEventListener("click", (event) => {
                        if (event.target.parentElement.nodeName !== "A") {
                            element.nextElementSibling.style.display = "none";
                        }
                });
            });
        }, 100);
    });
});

document.body.addEventListener("click", (event) => {
    let target = event.target;
    while (target != document.body) {
        if (target.id === "atariStMenuBar") {
            break;
        }
        target = target.parentElement;
    }

    if (target == document.body) {
        document.querySelector("#atariStMenuBarResponsive").style.display = "";

        document.querySelectorAll(".atariStMenuFoldout").forEach(element => {
            element.style.display = "";
        });
    }
});

document.querySelector("#atariStMenuBarResponsiveLabel").addEventListener("click", () => {
    document.querySelector("#atariStMenuBarResponsive").style.display = "block";
});

document.querySelectorAll(".atariStMenuFoldout").forEach(element => {
    element.previousElementSibling.addEventListener("click", () => {
        element.style.display = (element.style.display == "") ? "flex" : "";
    });

    document.addEventListener("click", (event) => {
        if ((event.target != element.previousElementSibling) && (!element.contains(event.target))) {
            element.style.display = "";
        }
    });
});

document.querySelectorAll(".atariStMenuItem, .atariStMenuFoldoutItem").forEach(element => {
    element.addEventListener("click", () => {
        element.classList.add("atariStMenuItemActive");
    });

    document.addEventListener("click", (event) => {
        if (event.target != element && !element.contains(event.target)) {
            element.classList.remove("atariStMenuItemActive");
        }
    });
});