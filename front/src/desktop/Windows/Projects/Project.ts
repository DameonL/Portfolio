import { VNode } from "preact";

export default interface Project {
  title: string;
  links: Array<{linkText: string, link: string; }>;
  description: VNode<HTMLElement>;
  technologies: Array<string>;
}