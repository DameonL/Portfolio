import ProjectList from "./ProjectList.js";
import OldSchoolWindow from "./Windows/OldSchoolWindow.js";
customElements.define("project-list", ProjectList);
customElements.define("oldschool-window", OldSchoolWindow);

let emailAddress = "ZGFtZW9ubGFpckBnbWFpbC5jb20=";

document.querySelectorAll(".oldSchoolDesktopItem").forEach(element => {
    element.addEventListener("click", () => {
        let newWindow = element.querySelector(".oldSchoolWindowTemplate").content.firstElementChild.cloneNode(true);
        document.querySelector("#oldSchoolDesktopItems").appendChild(newWindow);
    });
});

document.body.addEventListener("click", (event) => {
    let target = event.target;
    while (target != document.body) {
        if (target.id === "oldSchoolMenuBar") {
            break;
        }
        target = target.parentElement;
    }

    if (target == document.body) {
        document.querySelector("#oldSchoolMenuBarResponsive").style.display = "";

        document.querySelectorAll(".oldSchoolMenuFoldout").forEach(element => {
            element.style.display = "";
        });
    }
});

document.querySelector("#oldSchoolMenuBarResponsiveLabel").addEventListener("click", () => {
    document.querySelector("#oldSchoolMenuBarResponsive").style.display = "block";
});

document.querySelectorAll(".oldSchoolMenuFoldout").forEach(element => {
    element.previousElementSibling.addEventListener("click", () => {
        element.style.display = (element.style.display == "") ? "flex" : "";
    });

    document.addEventListener("click", (event) => {
        if ((event.target != element.previousElementSibling) && (!element.contains(event.target))) {
            element.style.display = "";
        }
    });
});

document.querySelectorAll(".oldSchoolMenuItem, .oldSchoolMenuFoldoutItem").forEach(element => {
    element.addEventListener("click", () => {
        element.classList.add("oldSchoolMenuItemActive");
    });

    document.addEventListener("click", (event) => {
        if (event.target != element && !element.contains(event.target)) {
            element.classList.remove("oldSchoolMenuItemActive");
        }
    });
});

document.querySelectorAll(".oldSchoolMenuItem").forEach(menuElement => {
    if ((menuElement.nextElementSibling) && (menuElement.nextElementSibling.nodeName === "TEMPLATE")) {
        menuElement.addEventListener("click", () => {
            let newWindow = menuElement.nextElementSibling.content.firstElementChild.cloneNode(true);
            document.querySelector("#oldSchoolDesktopItems").appendChild(newWindow);
            newWindow.click();
        });
    }
});