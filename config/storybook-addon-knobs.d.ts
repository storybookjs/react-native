declare module 'storybook-addon-knobs' {
  import WrapStory from "../src/components/WrapStory.js";

  interface KnobOption<T> {
    value: T,
    type: 'text' | 'boolean' | 'number' | 'object' | 'select' | 'date',
  }

  interface StoryContext {
    kind: string,
    story: string,
  }

  export function knob<T>(name: string, options: KnobOption<T>): T;

  export function text(name: string, value: string): string;

  export function boolean(name: string, value: boolean): boolean;

  export function number(name: string, value: number): number;

  export function object(name: string, value: Object): Object;

  export function select<T>(name: string, options: { [s: string]: T }, value: string): T;

  export function date(name: string, value: Date = new Date(0));

  export function withKnobs(storyFn: Function, context: StoryContext): WrapStory;
}
