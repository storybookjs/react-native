import { ClientStoryApi, Loadable } from '@storybook/addons';
import { ClientApi as ClientApiThing } from '@storybook/client-api';
import { StoryshotsOptions } from '../api/StoryshotsOptions';
import { SupportedFramework } from './SupportedFramework';

export type RenderTree = (story: any, context?: any, options?: any) => any;

export interface ClientApi extends ClientStoryApi<unknown> {
  configure(loader: Loadable, module: NodeModule | false): void;
  forceReRender(): void;
  clearDecorators: ClientApiThing['clearDecorators'];
  getStorybook: ClientApiThing['getStorybook'];
  setAddon: ClientApiThing['setAddon'];
  raw: ClientApiThing['raw'];
}

export interface Loader {
  load: (
    options: StoryshotsOptions
  ) => {
    framework: SupportedFramework;
    renderTree: RenderTree;
    renderShallowTree: any;
    storybook: ClientApi;
  };
  test: (options: StoryshotsOptions) => boolean;
}
