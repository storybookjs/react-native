// TODO, 'any' should be what is actually expected from a storyFn

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface RenderMainArgs {
  storyFn: () => any;
  selectedKind: string;
  selectedStory: string;
  showMain: () => void;
  showError: (args: ShowErrorArgs) => void;
  showException: (...args: any[]) => void;
  forceRender: boolean;
}

// TODO: some vue expert needs to look at this
export type StoryFnVueReturnType = any;

export interface ICollection {
  [p: string]: any;
}

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}
