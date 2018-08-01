import { NgModuleMetadata, ICollection } from './dist/client/preview/angular/types';
export { moduleMetadata } from './dist/client/preview/angular/decorators';

export interface IStorybookStory {
  name: string;
  render: () => any;
}

/** @todo typo in Storibook */
export interface IStoribookSection {
  kind: string;
  stories: IStorybookStory[];
}

export interface IStoryContext {
  kind: string;
  name: string;
  parameters: any;
}

export interface IStory {
  props?: ICollection;
  moduleMetadata?: Partial<NgModuleMetadata>;
  component?: any;
  template?: string;
}

export type IGetStory = (context: IStoryContext) => IStory;

export interface IApi {
  kind: string;
  addDecorator: (decorator: any) => IApi;
  addParameters: (parameters: any) => IApi;
  add: (storyName: string, getStory: IGetStory, parameters?: any) => IApi;
}

declare module '@storybook/angular' {
  export function storiesOf(kind: string, module: NodeModule): IApi;
  export function setAddon(addon: any): void;
  export function addDecorator(decorator: any): IApi;
  export function addParameters(parameters: any): IApi;
  export function configure(loaders: () => void, module: NodeModule): void;
  export function getStorybook(): IStoribookSection[];
}
