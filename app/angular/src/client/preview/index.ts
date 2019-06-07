import { start } from '@storybook/core/client';

import './globals';
import render from './render';
import { IApi, IStoribookSection } from './types';

interface ClientApi {
  storiesOf(kind: string, module: NodeModule): IApi;
  setAddon(addon: any): void;
  addDecorator(decorator: any): IApi;
  addParameters(parameter: any): IApi;
  configure(loaders: () => void, module: NodeModule): void;
  getStorybook(): IStoribookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: any; // todo add type
}

const { clientApi, configApi, forceReRender } = start(render);

export const {
  storiesOf,
  setAddon,
  addDecorator,
  addParameters,
  clearDecorators,
  getStorybook,
  raw,
}: ClientApi = clientApi;

export const { configure } = configApi;
export { forceReRender };
