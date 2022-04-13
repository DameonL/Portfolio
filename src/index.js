import ProjectList from "./ProjectList.js";
import AtariStWindow from "./Windows/AtariStWindow.js";
customElements.define("project-list", ProjectList);
customElements.define("atari-window", AtariStWindow);

let emailAddress = "ZGFtZW9ubGFpckBnbWFpbC5jb20=";

document.querySelectorAll(".atariStDesktopItem").forEach(element => {
    element.addEventListener("click", () => {
        let newWindow = element.querySelector(".atariStWindowTemplate").content.firstElementChild.cloneNode(true);
        document.querySelector("#atariStDesktopItems").appendChild(newWindow);
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
    let newWindow = document.querySelector("#aboutMeTemplate").content.firstElementChild.cloneNode(true);
    document.querySelector("#atariStDesktopItems").appendChild(newWindow);
    newWindow.click();
});

document.querySelector("#contactButton").addEventListener("click", () => {
    let newWindow = document.querySelector("#contactTemplate").content.firstElementChild.cloneNode(true);
    newWindow.querySelector("#contactMailToLink a").addEventListener("click", () => window.open(`mailto:${atob(emailAddress)}`));
    document.querySelector("#atariStDesktopItems").appendChild(newWindow);
    newWindow.click();
});
