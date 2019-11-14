import { StoryFn } from '@storybook/addons';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface RenderMainArgs {
  storyFn: StoryFn<any>;
  selectedKind: string;
  selectedStory: string;
  showMain: () => void;
  showError: (args: ShowErrorArgs) => void;
}

export interface MountViewArgs {
  Component: any;
  target: any;
  props: MountProps;
  on: any;
  Wrapper: any;
  WrapperData: any;
}

interface MountProps {
  rounded: boolean;
  text: string;
}

interface WrapperData {
  innerStyle: string;
  style: string;
}
