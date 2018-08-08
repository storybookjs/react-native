import { reaction } from 'mobx';
import qs from 'qs';

export default ({ history, store }) => {
  let currentAction;

  // update the history on story change, replace on POP
  reaction(
    () => ({
      selectedKind: store.selectedKind,
      selectedStory: store.selectedStory,
    }),
    () => {
      const newParams = qs.stringify({
        selectedKind: store.selectedKind,
        selectedStory: store.selectedStory,
        full: Number(store.shortcutOptions.goFullScreen),
        addons: Number(store.shortcutOptions.showAddonPanel),
        stories: Number(store.shortcutOptions.showStoriesPanel),
        panelRight: Number(store.shortcutOptions.addonPanelInRight),
        addonPanel: store.selectedAddonPanel,
      });

      // TODO: find a better way to ignore pop: maybe call this action from the selectStory action
      if (currentAction === 'POP') return;
      history.push({ search: newParams });
    }
  );

  // listen on url pop (navigator navigation)
  history.listen((location, action) => {
    currentAction = action;
    if (action === 'POP') {
      store.updateFromLocation(qs.parse(location.search, { ignoreQueryPrefix: true }));
    }
    currentAction = null;
  });

  // parse initial url
  store.updateFromLocation(qs.parse(history.location.search, { ignoreQueryPrefix: true }));
};
