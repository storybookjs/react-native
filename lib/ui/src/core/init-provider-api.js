import pick from 'lodash.pick';

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
          },
          selectedPanel: options.panel || options.selectedPanel || selectedPanel,
        });
      }
    },
  };

  provider.handleAPI(providerAPI);

  return providerAPI;
};
