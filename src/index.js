import ProjectList from "./ProjectList.js";
customElements.define("project-list", ProjectList);

function createWindow(labelText, innerElements) {
    let newWindow = document.querySelector("#atariStWindowTemplate").content.firstElementChild.cloneNode(true);
    console.log(newWindow);
    newWindow.querySelector(".atariStWindowTitlebarLabel").innerText = labelText;
    newWindow.querySelector(".atariStWindowContent").appendChild(innerElements);
    setUpWindowDrag(newWindow);
    setUpCloseButton(newWindow);
    document.querySelector("#atariStDesktopItems").appendChild(newWindow);
}

function setUpWindowDrag(targetWindow) {
    let dragging = false;
    let startOffsetX = 0;
    let startOffsetY = 0;

    let dragStart = (event) => {
        let x = (event.clientX) ? event.clientX : event.touches[0].clientX;
        let y = (event.clientY) ? event.clientY : event.touches[0].clientY;
        startOffsetX = x - targetWindow.offsetLeft;
        startOffsetY = y - targetWindow.offsetTop;
        dragging = true;
    }

    let dragMove = (event) => {
        if (dragging) {
            let x = (event.clientX) ? event.clientX : event.touches[0].clientX;
            let y = (event.clientY) ? event.clientY : event.touches[0].clientY;
            targetWindow.style.left = x - startOffsetX + "px";
            targetWindow.style.top = y - startOffsetY + "px";
        }
    }

    let dragEnd = (event) => {
        dragging = false;
    }

    let titlebar = targetWindow.querySelector(".atariStWindowTitlebar");
    titlebar.addEventListener("mousedown", dragStart);
    window.addEventListener("mousemove", dragMove);
    window.addEventListener("mouseup", dragEnd);

    titlebar.addEventListener("touchstart", dragStart);
    window.addEventListener("touchmove", dragMove);
    window.addEventListener("touchend", dragEnd);
}

function setUpCloseButton(targetWindow) {
    targetWindow.querySelector(".atariStWindowTitlebarClose").addEventListener("click", () => {
        targetWindow.addEventListener("animationend", () => targetWindow.remove());
        targetWindow.setAttribute("windowCloseAnimation", "");
    });
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

        setUpWindowDrag(newWindow);
        setUpCloseButton(newWindow);
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

document.querySelector("#aboutMeButton").addEventListener("click", () => {
    createWindow("About Me", document.querySelector("#aboutMeTemplate").content.firstElementChild.cloneNode(true));
});