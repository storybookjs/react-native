import { ClientApi } from '@storybook/client-api';
import { StoryshotsOptions } from '../api/StoryshotsOptions';
import { SupportedFramework } from './SupportedFramework';

export type RenderTree = (story: any, context?: any, options?: any) => any;

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
