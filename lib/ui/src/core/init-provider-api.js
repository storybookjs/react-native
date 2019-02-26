import pick from 'lodash.pick';
import deprecate from 'util-deprecate';

import { create } from '@storybook/theming';

const deprecationMessage = (optionsMap, prefix) =>
  `The options { ${Object.keys(optionsMap).join(', ')} } are deprecated -- use ${
    prefix ? `${prefix}'s` : ''
  } { ${Object.values(optionsMap).join(', ')} } instead.`;

const deprecatedThemeOptions = {
  name: 'brandTitle',
  url: 'brandUrl',
};
const applyDeprecatedThemeOptions = deprecate(({ name, url, theme }) => {
  const vars = {
    brandTitle: name,
    brandUrl: url,
    brandImage: null,
  };

  return { theme: create(vars, theme) };
}, deprecationMessage(deprecatedThemeOptions));
const checkDeprecatedThemeOptions = options => {
  if (Object.keys(deprecatedThemeOptions).find(key => !!options[key])) {
    return applyDeprecatedThemeOptions(options);
  }
  return {};
};

const deprecatedLayoutOptions = {
  goFullScreen: 'isFullscreen',
  showStoriesPanel: 'showNav',
  showAddonPanel: 'showPanel',
  addonPanelInRight: 'panelPosition',
};
const applyDeprecatedLayoutOptions = deprecate(options => {
  const layoutUpdate = {};

  ['goFullScreen', 'showStoriesPanel', 'showAddonPanel'].forEach(option => {
    if (typeof options[option] !== 'undefined') {
      layoutUpdate[deprecatedLayoutOptions[option]] = options[option];
    }
  });
  if (options.addonPanelInRight) {
    layoutUpdate.panelPosition = 'right';
  }
  return layoutUpdate;
}, deprecationMessage(deprecatedLayoutOptions));
const checkDeprecatedLayoutOptions = options => {
  if (Object.keys(deprecatedLayoutOptions).find(key => typeof options[key] !== 'undefined')) {
    return applyDeprecatedLayoutOptions(options);
  }
  return {};
};

export default ({ provider, api, store }) => {
  const providerAPI = {
    ...api,

    setOptions: options => {
      const { layout, ui, selectedPanel } = store.getState();

      if (options) {
        const updatedLayout = {
          ...layout,
          ...pick(options, Object.keys(layout)),
          ...checkDeprecatedLayoutOptions(options),
        };

        const updatedUi = {
          ...ui,
          ...pick(options, Object.keys(ui)),
          ...checkDeprecatedThemeOptions(options),
        };

        store.setState({
          layout: updatedLayout,
          ui: updatedUi,
          selectedPanel: options.panel || options.selectedPanel || selectedPanel,
        });
      }
    },
  };

  provider.handleAPI(providerAPI);

  return providerAPI;
};
