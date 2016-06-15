export default function (provider, reduxStore, actions) {
  const providerApi = {
    onStory(cb) {
      providerApi._onStoryCallback = cb;
    },

    addAction: actions.api.addAction,
    setStories: actions.api.setStories,
    selectStory: actions.api.selectStory,
    handleShortcut: actions.shortcuts.handleEvent,
  };

  provider.handleAPI(providerApi);

  // subscribe to redux store and trigger onStory's callback
  reduxStore.subscribe(function () {
    const { api } = reduxStore.getState();
    if (!api) return;

    providerApi._onStoryCallback(api.selectedKind, api.selectedStory);
  });
}
