import { start } from '@storybook/core/client';

import './globals';
import { ClientStoryApi, Loadable, DecoratorFunction } from '@storybook/addons';
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

export const addDecorator = (decorator: DecoratorFunction) =>
  clientApi.addDecorator(decorator, framework);

export const { setAddon, addParameters, clearDecorators, getStorybook, raw } = clientApi;

export { forceReRender };
