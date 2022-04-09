import ProjectList from "./ProjectList.js";
customElements.define("project-list", ProjectList);

document.querySelectorAll(".atariStDesktopItem").forEach(element => {
    element.addEventListener("click", () => {
        let newWindow = element.querySelector(".atariStDesktopItemWindowTemplate").content.firstElementChild.cloneNode(true);
        newWindow.style.display = "block";
        
        document.querySelector("#atariStDesktopItems").appendChild(newWindow);

        let innerWindow = newWindow.querySelector("[loadFromUrl]");
        if (innerWindow) {
            newWindow.querySelector(".atariStDesktopItemWindowContent").style.overflow = "hidden";
            innerWindow.setAttribute("src", innerWindow.getAttribute("loadFromUrl"));
        }

        newWindow.querySelector(".atariStDesktopItemWindowTitlebarClose").addEventListener("click", () => {
            newWindow.addEventListener("animationend", () => newWindow.remove());
            newWindow.setAttribute("windowCloseAnimation", "");
        });

        let dragging = false;
        let titleBar = newWindow.querySelector(".atariStDesktopItemWindowTitlebar");
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

        titleBar.addEventListener("mousedown", dragStart);
        window.addEventListener("mousemove", dragMove);
        window.addEventListener("mouseup", dragEnd);

        titleBar.addEventListener("touchstart", dragStart);
        window.addEventListener("touchmove", dragMove);
        window.addEventListener("touchend", dragEnd);      
    });
});