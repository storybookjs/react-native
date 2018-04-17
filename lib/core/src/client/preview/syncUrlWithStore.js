import qs from 'qs';
import { window } from 'global';
import { selectStory } from './actions';

// Ensure the story in the redux store and on the preview URL are in sync.
// In theory we should listen to pushState events but given it's an iframe
// the user can't actually change the URL.
// We should change this if we support a "preview only" mode in the future.
export default function syncUrlToStore(reduxStore) {
  // handle query params
  const queryParams = qs.parse(window.location.search.substring(1));
  if (queryParams.selectedKind) {
    reduxStore.dispatch(selectStory(queryParams.selectedKind, queryParams.selectedStory));
  }

  reduxStore.subscribe(() => {
    const { selectedKind, selectedStory } = reduxStore.getState();

    const queryString = qs.stringify({
      ...queryParams,
      selectedKind,
      selectedStory,
    });
    window.history.replaceState({}, '', `?${queryString}`);
  });
}
