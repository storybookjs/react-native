import { StoryFn } from "@storybook/addons";

export interface ICollection {
  [p: string]: any;
}

export interface NgModuleMetadata {
  declarations?: any[];
  entryComponents?: any[];
  imports?: any[];
  schemas?: any[];
  providers?: any[];
}

export interface IStory {
  component?: any;
  props?: ICollection;
  propsMeta?: ICollection;
  moduleMetadata?: NgModuleMetadata;
  template?: string;
  styles?: string[];
}
declare module '@storybook/addon-centered/angular' {
  export function centered(story: StoryFn<IStory>): IStory;
}
