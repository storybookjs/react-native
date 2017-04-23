declare var module: any; // dangerous

type RenderFunction = Function;

interface StoryDecorator {
  (story: RenderFunction, context: { kind: string, story: string }): Object | null;
}

interface Story {
    add (storyName: string, callback: Function): Story;
    addDecorator (decorator: StoryDecorator): Story;
}

export function addDecorator(decorator: StoryDecorator): void;
export function configure(fn: Function, module: any): void;
export function linkTo(name: string, ...params: any[]): void;
export function storiesOf(name: string, module: any): Story;
export function action(name: string, ...params: any[]): any;

type StoryObject = {
  name: string,
  render: RenderFunction,
};

type StoryBucket = {
  kind: string,
  stories: StoryObject[],
};

export function getStorybook(): StoryBucket[];
