import { VNode } from "preact";

export default interface Sample {
  label: string;
  description: VNode<HTMLElement>;
  technologies: VNode<HTMLUListElement>;
  link: string;
  github?: string;
}
