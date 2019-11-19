import { TemplateResult } from 'lit-html';

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export type StoryFnPolymerReturnType = string | Node | TemplateResult;

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface RenderMainArgs {
  storyFn: (...args: any[]) => StoryFnPolymerReturnType;
  selectedKind: string;
  selectedStory: string;
  showMain: () => void;
  showError: (args: ShowErrorArgs) => void;
  showException: (err: Error) => void;
  forceRender: boolean;
}
