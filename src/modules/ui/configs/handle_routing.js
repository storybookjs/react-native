import qs from 'qs';
export const config = {
  insidePopState: false,
};

export function changeUrl(reduxStore) {
  // Do not change the URL if we are inside a popState event.
  if (config.insidePopState) return;

  const { api, shortcuts, ui } = reduxStore.getState();
  if (!api) return;

  const { selectedKind, selectedStory, customQueryParams } = api;

  const {
    goFullScreen: full,
    showDownPanel: down,
    showLeftPanel: left,
    downPanelInRight: panelRight,
  } = shortcuts;

  const {
    selectedDownPanel: downPanel,
  } = ui;

  const urlObj = {
    ...customQueryParams,
    selectedKind,
    selectedStory,
    full: Number(full),
    down: Number(down),
    left: Number(left),
    panelRight: Number(panelRight),
    downPanel,
  };

  const url = `?${qs.stringify(urlObj)}`;

  const state = {
    ...urlObj,
    full,
    down,
    left,
    panelRight,
    url,
  };

  window.history.pushState(state, '', url);
}

export function updateStore(queryParams, actions) {
  const {
    selectedKind,
    selectedStory,
    full = 0,
    down = 1,
    left = 1,
    panelRight = 0,
    downPanel,
    ...customQueryParams,
  } = queryParams;

  if (selectedKind && selectedStory) {
    actions.api.selectStory(selectedKind, selectedStory);
  }

  actions.shortcuts.setOptions({
    goFullScreen: Boolean(Number(full)),
    showDownPanel: Boolean(Number(down)),
    showLeftPanel: Boolean(Number(left)),
    downPanelInRight: Boolean(Number(panelRight)),
  });

  if (downPanel) {
    actions.ui.selectDownPanel(downPanel);
  }
  actions.api.setQueryParams(customQueryParams);
}

export function handleInitialUrl(actions, location) {
  const queryString = location.search.substring(1);
  if (!queryString || queryString === '') return;

  const parsedQs = qs.parse(queryString);
  updateStore(parsedQs, actions);
}

export default function ({ reduxStore }, actions) {
  // handle initial URL
  handleInitialUrl(actions, window.location);

  // subscribe to reduxStore and change the URL
  reduxStore.subscribe(() => changeUrl(reduxStore));
  changeUrl(reduxStore);

  // handle back button
  window.onpopstate = () => {
    config.insidePopState = true;
    handleInitialUrl(actions, window.location);
    config.insidePopState = false;
  };
}
