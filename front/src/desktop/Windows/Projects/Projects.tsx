import Project from "./Project";

const projects: Project[] = [
  {
    title: "Beyond Blue Skies",
    links: [
      {
        linkText: "Code Samples Available Upon Request",
        link: "",
      },
    ],
    description: (
      <div>
        A full-featured mobile shoot 'em up game with RPG mechanics, featuring
        an original soundtrack, dialogue, and unlockable content. The player
        steers a spaceship through procedurally created levels, fighting a
        variety of enemies and avoiding environmental obstacles while collecting
        power-ups.
      </div>
    ),
    technologies: ["C#", "Unity", "Visual Studio"],
  },
  {
    title: "Green Mamba Stealth",
    links: [
      {
        linkText: "Source Code",
        link: "https://github.com/DameonL/GreenMambaStealth",
      },
    ],
    description: (
      <div>
        An extension for Unity3D which provides a system to analyze the way
        lighting affects an object and determine whether that object should be
        considered "hidden" for an NPC observer.
      </div>
    ),
    technologies: ["C#", "Unity", "Visual Studio"],
  },
  {
    title: "To Do List",
    links: [
      {
        linkText: "Source Code",
        link: "https://github.com/DameonL/ToDoList",
      },
      {
        linkText: "Try It!",
        link: "https://dameonl.github.io/ToDoList/",
      },
    ],
    description: (
      <div>
        A vanilla Javascript implementation of an advanced To Do List, featuring
        a list which can be rearranged using drag and drop, and an advanced text
        editor.
      </div>
    ),
    technologies: ["JavaScript", "HTML/CSS", "WebComponents"],
  },
  {
    title: "Calc You Later",
    links: [
      {
        linkText: "Source Code",
        link: "https://github.com/DameonL/CalcYouLater",
      },
      {
        linkText: "Try It!",
        link: "https://dameonl.github.io/CalcYouLater/",
      },
    ],
    description: (
      <div>
        A robust scientific calculator created using the React framework."
      </div>
    ),
    technologies: ["JavaScript", "React.js", "HTML/CSS"],
  },
  {
    title: "Match Three Unity",
    links: [
      {
        linkText: "Source Code",
        link: "https://github.com/DameonL/MatchThreeUnity",
      },
    ],
    description: (
      <div>
        An example Match Three game for the Unity3D game engine which provides
        an expandable framework to create Match Three style games.
      </div>
    ),
    technologies: ["C#", "Unity", "Visual Studio"],
  },
  {
    title: "Serializable Collections for Unity",
    links: [
      {
        linkText: "Source Code",
        link: "https://github.com/DameonL/Serializable-Collections-For-Unity",
      },
    ],
    description: (
      <div>
        A library which adds support for serializing a variety of collections to
        the Unity3D game engine and updates the Unity3D editor to support
        viewing those collections.
      </div>
    ),
    technologies: ["C#", "Unity", "Visual Studio"],
  },
];

export default projects;
