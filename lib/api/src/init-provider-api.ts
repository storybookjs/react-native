import { API } from './index';
import Store from './store';
import { ReactElement } from 'react';

export interface Provider {
  [key: string]: any;
  renderPreview?: () => ReactElement;
  handleAPI(api: API): void;
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
