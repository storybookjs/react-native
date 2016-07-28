export default function (provider, reduxStore, actions) {
  const providerApi = {
    onStory(cb) {
      providerApi._onStoryCallback = cb;
    },

    setStories: actions.api.setStories,
    selectStory: actions.api.selectStory,
    setOptions: actions.api.setOptions,
    handleShortcut: actions.shortcuts.handleEvent,
  };

  provider.handleAPI(providerApi);

  // subscribe to redux store and trigger onStory's callback
  reduxStore.subscribe(function () {
    const { api } = reduxStore.getState();
    if (!api) return;
    if (!providerApi._onStoryCallback) return;

    providerApi._onStoryCallback(api.selectedKind, api.selectedStory);
  });
}
