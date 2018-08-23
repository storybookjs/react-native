import { parseQuery, stringifyQuery } from './router';

export default function handleHistoryLoad({ location, navigate }, { store, uiStore }) {
  const query = parseQuery(location);

  if (query.full === '1') {
    uiStore.toggleFullscreen(true);
  }

  if (query.panel) {
    if (['right', 'bottom'].includes(query.panel)) {
      uiStore.togglePanelPosition(query.panel);
    } else if (query.panel === '0') {
      uiStore.togglePanel(false);
    }
  }

  if (query.nav === '0') {
    uiStore.toggleNav(false);
  }

  if (query.selectedKind && query.selectedStory) {
    store.selectStory(query.selectedKind, query.selectedStory);
  }

  if (!query.path || query.path === '/') {
    // TODO: strip unwanted query params and keep the one we need
    const search = stringifyQuery({ path: '/components' });
    navigate(`/${search}`, { replace: true });
  } else {
    // TODO: strip unwanted query params and keep the one we need
    const search = stringifyQuery({ path: query.path });
    navigate(`/${search}`, { replace: true });
  }
}
