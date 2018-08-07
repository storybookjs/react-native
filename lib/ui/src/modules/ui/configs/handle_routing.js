// import { window, location, history } from 'global';
// import qs from 'qs';

// export const config = {
//   insidePopState: false,
// };

// export function getUrlState(data) {
//   const { selectedKind, selectedStory, customQueryParams } = data;

//   const {
//     goFullScreen: full,
//     showAddonPanel: addons,
//     showStoriesPanel: stories,
//     addonPanelInRight: panelRight,
//   } = data.shortcutOptions;

//   const { selectedAddonPanel: addonPanel } = data;

//   const urlObj = {
//     selectedKind,
//     selectedStory,
//     full: Number(full),
//     addons: Number(addons),
//     stories: Number(stories),
//     panelRight: Number(panelRight),
//     addonPanel,
//     ...customQueryParams,
//   };

//   const url = `?${qs.stringify(urlObj)}`;

//   return {
//     ...urlObj,
//     full,
//     addons,
//     stories,
//     panelRight,
//     url,
//   };
// }

// export function changeUrl(clientStore, usePush) {
//   // Do not change the URL if we are inside a popState event.
//   if (config.insidePopState) return;

//   const data = clientStore.getAll();
//   if (!data.selectedKind) return;

//   const state = getUrlState(data);
//   history[usePush ? 'pushState' : 'replaceState'](state, '', state.url);
// }

// export function updateStore(queryParams, actions) {
//   const {
//     selectedKind,
//     selectedStory,
//     full = 0,
//     down = 1,
//     addons = down,
//     left = 1,
//     stories = left,
//     panelRight = 0,
//     downPanel,
//     addonPanel = downPanel,
//     ...customQueryParams
//   } = queryParams;

//   if (selectedKind) {
//     actions.api.selectStory(selectedKind, selectedStory);
//   }

//   actions.shortcuts.setOptions({
//     goFullScreen: Boolean(Number(full)),
//     showAddonPanel: Boolean(Number(addons)),
//     showStoriesPanel: Boolean(Number(stories)),
//     addonPanelInRight: Boolean(Number(panelRight)),
//   });

//   if (addonPanel) {
//     actions.ui.selectAddonPanel(addonPanel);
//   }
//   actions.api.setQueryParams(customQueryParams);
// }

// export function handleInitialUrl(actions, l) {
//   const queryString = l.search.substring(1);
//   if (!queryString || queryString === '') return;

//   const parsedQs = qs.parse(queryString);
//   updateStore(parsedQs, actions);
// }

// export default function({ clientStore }, actions) {
//   // handle initial URL
//   handleInitialUrl(actions, location);

//   const data = clientStore.getAll();
//   let prevKind = data.selectedKind;
//   let prevStory = data.selectedStory;

//   // subscribe to clientStore and change the URL
//   clientStore.subscribe(() => {
//     const { selectedKind, selectedStory } = clientStore.getAll();
//     // use pushState only when a new story is selected
//     const usePush =
//       prevKind != null &&
//       prevStory != null &&
//       (selectedKind !== prevKind || selectedStory !== prevStory);
//     changeUrl(clientStore, usePush);
//     prevKind = selectedKind;
//     prevStory = selectedStory;
//   });
//   changeUrl(clientStore);

//   // handle back button
//   window.onpopstate = () => {
//     config.insidePopState = true;
//     handleInitialUrl(actions, location);
//     config.insidePopState = false;
//   };
// }

import { window, location, history } from 'global';
import { autorun } from 'mobx';
import qs from 'qs';

export const config = {
  insidePopState: false
};

export function getUrlState(store) {
  const {
    selectedKind,
    selectedStory,
    customQueryParams,
    selectedAddonPanel: addonPanel
  } = store;

  const {
    goFullScreen: full,
    showAddonPanel: addons,
    showStoriesPanel: stories,
    addonPanelInRight: panelRight
  } = store.shortcutOptions;

  const urlObj = {
    selectedKind,
    selectedStory,
    full: Number(full),
    addons: Number(addons),
    stories: Number(stories),
    panelRight: Number(panelRight),
    addonPanel,
    ...customQueryParams
  };

  const url = `?${qs.stringify(urlObj)}`;

  return {
    ...urlObj,
    full,
    addons,
    stories,
    panelRight,
    url
  };
}

export function changeUrl(store, usePush) {
  // Do not change the URL if we are inside a popState event.
  if (config.insidePopState) return;

  if (!store.selectedKind) return;

  const state = getUrlState(store);
  history[usePush ? 'pushState' : 'replaceState'](state, '', state.url);
}

export function updateStore(store, queryParams) {
  const {
    selectedKind,
    selectedStory,
    full = 0,
    down = 1,
    addons = down,
    left = 1,
    stories = left,
    panelRight = 0,
    downPanel,
    addonPanel = downPanel,
    ...customQueryParams
  } = queryParams;

  if (selectedKind) {
    store.selectStory(selectedKind, selectedStory);
  }

  store.setShortcutsOptions({
    goFullScreen: Boolean(Number(full)),
    showAddonPanel: Boolean(Number(addons)),
    showStoriesPanel: Boolean(Number(stories)),
    addonPanelInRight: Boolean(Number(panelRight))
  });

  if (addonPanel) {
    store.selectAddonPanel(addonPanel);
  }
  store.setQueryParams(customQueryParams);
}

export function handleInitialUrl(store, l) {
  const queryString = l.search.substring(1);
  if (!queryString || queryString === '') return;

  const parsedQs = qs.parse(queryString);
  updateStore(store, parsedQs);
}

export default function(store) {
  // handle initial URL
  handleInitialUrl(store, location);

  let prevKind = store.selectedKind;
  let prevStory = store.selectedStory;

  // subscribe to clientStore and change the URL
  autorun(() => {
    // use pushState only when a new story is selected
    const usePush =
      prevKind != null &&
      prevStory != null &&
      (store.selectedKind !== prevKind || store.selectedStory !== prevStory);
    changeUrl(store, usePush);
    prevKind = store.selectedKind;
    prevStory = store.selectedStory;
  });

  changeUrl(store);

  // handle back button
  window.onpopstate = () => {
    config.insidePopState = true;
    handleInitialUrl(store, location);
    config.insidePopState = false;
  };
}
