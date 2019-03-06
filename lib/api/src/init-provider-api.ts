import { API } from './index';
import Store from './store';

interface Provider {
  handleAPI(api: API): void;
  renderPreview(): void;
  [key: string]: any;
}

export default ({ provider, api }: { provider: Provider; api: API; store: Store }) => {
  provider.handleAPI(api);

  return api;
};
