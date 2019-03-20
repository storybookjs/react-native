import { start } from '@storybook/core/client';

import './globals';
import render from './render';

export interface NgModuleMetadata {
  declarations?: any[];
  entryComponents?: any[];
  imports?: any[];
  schemas?: any[];
  providers?: any[];
}

export type moduleMetadata = NgModuleMetadata;

export interface ICollection {
  [p: string]: any;
}

export interface NgStory {
  component?: any;
  props: ICollection;
  propsMeta?: ICollection;
  moduleMetadata?: NgModuleMetadata;
  template?: string;
}
export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

// TODO: remove */
type IStoribookSection = IStorybookSection;

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

const { clientApi, configApi, forceReRenderFn } = start(render);

const {
  // storiesOf,
  // setAddon,
  // addDecorator,
  // addParameters,
  // clearDecorators,
  // getStorybook,
  // raw,
} = clientApi;

// export

// export const { configure } = configApi;
// export { forceReRender };

export function storiesOf(kind: string, module: NodeModule): IApi {
  return clientApi.storiesOf(kind, module);
}
export function setAddon(addon: any): void {
  return clientApi.setAddon(addon);
}
export function addDecorator(decorator: any): IApi {
  return clientApi.addDecorator(decorator);
}
export function addParameters(decorator: any): IApi {
  return clientApi.addParameters(decorator);
}
export function configure(loaders: () => void, module: NodeModule): void {
  return configApi.configure(loaders, module);
}
export function getStorybook(): IStoribookSection[] {
  return clientApi.getStorybook();
}
export function raw(): any[] {
  return clientApi.raw();
}
export function clearDecorators(): void {
  clientApi.clearDecorators();
}
export function forceReRender(): void {
  forceReRenderFn();
}
