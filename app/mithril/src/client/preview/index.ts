import { start } from '@storybook/core/client';

import './globals';
import { ClientStoryApi, Loadable } from '@storybook/addons';
import render from './render';

import { IStorybookSection, StoryFnMithrilReturnType } from './types';

const { configure: coreConfigure, clientApi, forceReRender } = start(render);

const framework = 'mithril';

interface ClientApi extends ClientStoryApi<StoryFnMithrilReturnType> {
  setAddon(addon: any): void;
  configure(loader: Loadable, module: NodeModule): void;
  getStorybook(): IStorybookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: () => any; // todo add type
}

export const storiesOf: ClientApi['storiesOf'] = (kind, m) =>
  (clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({ framework });

export const configure: ClientApi['configure'] = (...args) => coreConfigure(...args, framework);

export const { setAddon } = clientApi;
export const { addDecorator } = clientApi;
export const { addParameters } = clientApi;
export const { clearDecorators } = clientApi;
export const { getStorybook } = clientApi;
export const { raw } = clientApi;

export { forceReRender };
