import pick from 'lodash.pick';

import { API } from './index';
import Store from './store';

interface Provider {
  handleAPI(api: API): void;
  renderPreview(): void;
  [key: string]: any;
}

interface Options {
  selectedPanel?: string;
  panel?: string;
  isFullscreen?: boolean;
  showPanel?: boolean;
  panelPosition?: 'bottom' | 'right';
  showNav?: boolean;
}

export default ({ provider, api, store }: { provider: Provider; api: API; store: Store }) => {
  const providerAPI: API = {
    ...api,

    setOptions: (options: Options) => {
      const { layout, ui, selectedPanel } = store.getState();

      if (options) {
        store.setState({
          layout: {
            ...layout,
            ...pick(options, Object.keys(layout)),
          },
          ui: {
            ...ui,
            ...pick(options, Object.keys(ui)),
          },
          selectedPanel: options.panel || options.selectedPanel || selectedPanel,
        });
      }
    },
  };

  provider.handleAPI(providerAPI);

  return providerAPI;
};
