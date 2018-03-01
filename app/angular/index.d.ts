import { NgModuleMetadata, ICollection } from './dist/client/preview/angular/types';
export { moduleMetadata } from './dist/client/preview/angular/decorators';

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStoribookSection {
  kind: string;
  stories: IStorybookStory[];
}

export interface IStoryContext {
  kind: string;
  name: string;
  parameters: any;
}

export type IGetStory = (
  IStoryContext
) => {
  props?: ICollection;
  moduleMetadata?: Partial<NgModuleMetadata>;
  component?: any;
  template?: string;
};

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
  export function configure(loaders: () => NodeRequire, module: NodeModule): void;
  export function getStorybook(): IStoribookSection[];
}
