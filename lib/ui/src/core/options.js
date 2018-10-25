import pick from 'lodash.pick';

import { ensurePanel } from './panels';

export default function({ store }) {
  return {
    setOptions(changes) {
      const { uiOptions: oldOptions, selectedPanel, panels } = store.getState();
      const { newSelectedPanel } = changes;
      const options = pick(changes, Object.keys(oldOptions));

      store.setState({
        uiOptions: {
          ...oldOptions,
          ...options,
        },
      });

      if (newSelectedPanel && newSelectedPanel !== selectedPanel) {
        store.setState({
          selectedPanel: ensurePanel(panels, newSelectedPanel, selectedPanel),
        });
      }
    },
    setShortcutsOptions(options) {
      const { shortcutOptions } = store.getState();

      store.setState({
        shortcutOptions: {
          ...shortcutOptions,
          ...pick(options, Object.keys(shortcutOptions)),
        },
      });
    },
    setQueryParams(customQueryParams) {
      const state = store.getState();
      store.setState({
        customQueryParams: {
          ...state.customQueryParams,
          ...Object.keys(customQueryParams).reduce((acc, key) => {
            if (customQueryParams[key] !== null) acc[key] = customQueryParams[key];
            return acc;
          }, {}),
        },
      });
    },
  };
}
