import qs from 'qs';
export const config = {
  insidePopState: false,
};

export function changeUrl(reduxStore) {
  // Do not change the URL if we are inside a popState event.
  if (config.insidePopState) return;

  const { api } = reduxStore.getState();
  if (!api) return;

  const { selectedKind, selectedStory } = api;
  const queryString = qs.stringify({ selectedKind, selectedStory });

  if (queryString === '') return;

  const url = `?${queryString}`;
  const state = {
    url,
    selectedKind,
    selectedStory,
  };

  window.history.pushState(state, '', url);
}

export function updateStore(queryParams, actions) {
  const { selectedKind, selectedStory } = queryParams;
  if (selectedKind && selectedStory) {
    actions.api.selectStory(selectedKind, selectedStory);
  }
}

export function handleInitialUrl(actions, location) {
  const queryString = location.search.substring(1);
  if (!queryString || queryString === '') return;

  const parsedQs = qs.parse(queryString);
  updateStore(parsedQs, actions);
}

export default function ({ reduxStore }, actions) {
  // subscribe to reduxStore and change the URL
  reduxStore.subscribe(() => changeUrl(reduxStore));
  changeUrl(reduxStore);

  // handle initial URL
  handleInitialUrl(actions, window.location);

  // handle back button
  window.onpopstate = () => {
    config.insidePopState = true;
    handleInitialUrl(actions, window.location);
    config.insidePopState = false;
  };
}
