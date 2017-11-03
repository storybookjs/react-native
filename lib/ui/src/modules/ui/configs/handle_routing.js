import { window } from 'global';
import qs from 'qs';

export const config = {
  insidePopState: false,
};

export function getUrlState(data) {
  const { selectedKind, selectedStory, customQueryParams } = data;

  const {
    goFullScreen: full,
    showAddonPanel: addons,
    showStoriesPanel: stories,
    addonPanelInRight: panelRight,
  } = data.shortcutOptions;

  const { selectedAddonPanel: addonPanel } = data;

  const urlObj = {
    ...customQueryParams,
    selectedKind,
    selectedStory,
    full: Number(full),
    addons: Number(addons),
    stories: Number(stories),
    panelRight: Number(panelRight),
    addonPanel,
  };

  const url = `?${qs.stringify(urlObj)}`;

  return {
    ...urlObj,
    full,
    addons,
    stories,
    panelRight,
    url,
  };
}

export function changeUrl(clientStore) {
  // Do not change the URL if we are inside a popState event.
  if (config.insidePopState) return;

  const data = clientStore.getAll();
  if (!data.selectedKind) return;

  const state = getUrlState(data);
  window.history.pushState(state, '', state.url);
}

export function updateStore(queryParams, actions) {
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
    actions.api.selectStory(selectedKind, selectedStory);
  }

  actions.shortcuts.setOptions({
    goFullScreen: Boolean(Number(full)),
    showAddonPanel: Boolean(Number(addons)),
    showStoriesPanel: Boolean(Number(stories)),
    addonPanelInRight: Boolean(Number(panelRight)),
  });

  if (addonPanel) {
    actions.ui.selectAddonPanel(addonPanel);
  }
  actions.api.setQueryParams(customQueryParams);
}

export function handleInitialUrl(actions, location) {
  const queryString = location.search.substring(1);
  if (!queryString || queryString === '') return;

  const parsedQs = qs.parse(queryString);
  updateStore(parsedQs, actions);
}

export default function({ clientStore }, actions) {
  // handle initial URL
  handleInitialUrl(actions, window.location);

  // subscribe to clientStore and change the URL
  clientStore.subscribe(() => changeUrl(clientStore));
  changeUrl(clientStore);

  // handle back button
  window.onpopstate = () => {
    config.insidePopState = true;
    handleInitialUrl(actions, window.location);
    config.insidePopState = false;
  };
}
