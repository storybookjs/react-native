import pick from 'lodash.pick';
import deprecate from 'util-deprecate';

import { create } from '@storybook/theming';

const deprecatedUiOptions = ['name', 'url'];
const applyDeprecatedUiOptions = deprecate(({ name, url, theme }) => {
  const vars = {
    brandTitle: name,
    brandUrl: url,
    brandImage: null,
  };

  return { theme: create(vars, theme) };
}, 'The `name` and `url` options are deprecated -- instead use the `theme.brandTitle` or `theme.brandUrl`');
const checkDeprecatedUiOptions = options => {
  if (deprecatedUiOptions.find(key => !!options[key])) {
    return applyDeprecatedUiOptions(options);
  }
  return {};
};

export default ({ provider, api, store }) => {
  const providerAPI = {
    ...api,

    setOptions: options => {
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
            ...checkDeprecatedUiOptions(options),
          },
          selectedPanel: options.panel || options.selectedPanel || selectedPanel,
        });
      }
    },
  };

  provider.handleAPI(providerAPI);

  return providerAPI;
};
