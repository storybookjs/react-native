/*
 * ATTENTION:
 * - moduleMetadata
 * - NgModuleMetadata
 * - ICollection
 *
 * These typings are coped out of decorators.d.ts and types.d.ts in order to fix a bug with tsc
 * It was imported out of dist before which was not the proper way of exporting public API
 *
 * This can be fixed by migrating app/angular to typescript
 */
export declare const moduleMetadata: (
  metadata: Partial<NgModuleMetadata>
) => (storyFn: () => any) => any;

export interface NgModuleMetadata {
  declarations?: any[];
  entryComponents?: any[];
  imports?: any[];
  schemas?: any[];
  providers?: any[];
}
export interface ICollection {
  [p: string]: any;
}

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

  export function forceReRender(): void;
}
