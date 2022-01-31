let textDecorators = {
    "Title" : ["- **", "**"],
    "Language" : ["_", "_"],
    "linkText" : ["[", "]"],
    "link" : ["(", ")"],
    "Features" : ["- ", ""],
    "Description" : ["", ""]
}

let projectLayout = `
- **<Title>**
    
    <Description>
 
    **Language:** _<Language>_

    <Links>

    **Features:**
<Features>
`;

fetch("./ProjectList.json")
.then(response => {
   return response.json();
})
.then(data => {
    GenerateList(data);
});

function GenerateList(projectList) {
    let target = document.getElementById("renderTarget");
    let listElement = document.createElement("plaintext");
    let listText = "";
    projectList.forEach(project => {
        listText += GenerateProject(project);
    });
    listElement.innerText = listText;
    target.appendChild(listElement);
}

function GenerateProject(project) {
    let projectText = projectLayout;
    for (property in project) {
        let pattern = new RegExp(`<${property}>`, "g");
        if (!Array.isArray(project[property])) {
            projectText = projectText.replace(pattern, project[property]);
        } else {
            let listText = "";
            for (let i = 0; i < project[property].length; i++) {
                let item = project[property][i];
                if (item instanceof Object) {
                    listText += `[${item["linkText"]}](${item["link"]})`;
                    if (project[property].length > 1 && i < project[property].length - 1) {
                        listText += " / "
                    }
                } else {
                    listText += "    - " + item + "\n";
                }
            }
            projectText = projectText.replace(pattern, listText);
        }
    }
    return projectText;
}