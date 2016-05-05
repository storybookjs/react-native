export default function (bus, reduxStore, actions) {
  const state = reduxStore.getState();
  const dataId = state.core.dataId;

  // subscribe to redux store and send down changes to pageBus.
  reduxStore.subscribe(function () {
    const { api } = reduxStore.getState();
    if (!api) return;

    const payload = {
      kind: api.selectedKind,
      story: api.selectedStory,
    };

    bus.emit(`${dataId}.setCurrentStory`, JSON.stringify(payload));
  });

  // watch pageBus and put both actions and stories.
  bus.on(`${dataId}.addAction`, function (payload) {
    const data = JSON.parse(payload);
    actions.api.addAction(data.action);
  });

  bus.on(`${dataId}.setStories`, function (payload) {
    const data = JSON.parse(payload);
    actions.api.setStories(data.stories);
  });

  bus.on(`${dataId}.selectStory`, function (payload) {
    const data = JSON.parse(payload);
    actions.api.selectStory(data.kind, data.story);
  });

  bus.on(`${dataId}.applyShortcut`, function (payload) {
    const data = JSON.parse(payload);
    actions.shortcuts.handleEvent(data.event);
  });
}
