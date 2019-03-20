import { ReactElement } from 'react';
import { Channel } from '@storybook/channels';

import { API } from './index';
import Store from './store';

export interface Provider {
  channel?: Channel;
  renderPreview?: () => ReactElement;
  handleAPI(api: API): void;
  [key: string]: any;
}

export interface SubAPI {
  renderPreview?: Provider['renderPreview'];
}

export default ({ provider, api }: { provider: Provider; api: API; store: Store }) => {
  provider.handleAPI(api);

  if (provider.renderPreview) {
    api.renderPreview = provider.renderPreview;
  }

  return api;
};
