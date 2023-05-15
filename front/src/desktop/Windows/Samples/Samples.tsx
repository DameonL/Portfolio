import Sample from "./Sample";

const Samples: Sample[] = [
  {
    label: "Weather",
    description: (
      <div>
        A weather app built to be deployed as an Azure Static Website that retrieves data using a managed API.
      </div>
    ),
    technologies: (
      <ul>
        <li>React</li>
        <li>Material UI</li>
        <li>Vite</li>
        <li>Node</li>
        <li>Microsoft Azure</li>
      </ul>
    ),
    link: "https://weather.dameonlaird.com",
    github: "https://github.com/DameonL/weather-app",
  },
  {
    label: "I Love Lamp",
    description: (
      <div>
        A simple, elegant single page application e-shopping site developed in vanilla JavaScript which demonstrates the
        power of WebComponents. Features a fully-functional shopping cart stored using cookies. All products are stored
        using Google Firestore and retrieved using a REST API.
      </div>
    ),
    technologies: (
      <ul>
        <li>Vanilla JavaScript</li>
        <li>HTML/CSS</li>
        <li>Google Firestore</li>
      </ul>
    ),
    link: "https://dameonl.github.io/ILoveLamp/",
    github: "https://github.com/DameonL/ILoveLamp",
  },
];

export default Samples;
