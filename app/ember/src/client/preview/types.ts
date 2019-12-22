import { StoryFn } from '@storybook/addons'; // eslint-disable-line

export interface RenderMainArgs {
  storyFn: StoryFn<any>;
  selectedKind: string;
  selectedStory: string;
  showMain: () => void;
  showError: (args: ShowErrorArgs) => void;
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface ElementArgs {
  el: HTMLElement;
}

export interface OptionsArgs {
  template: any;
  context: any;
  element: any;
}
