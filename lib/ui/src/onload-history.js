import { parseQuery, stringifyQuery } from './router';

export default function handleHistoryLoad({ location, navigate }, manager) {
  const query = parseQuery(location);

  if (query.full === '1') {
    manager.toggleFullscreen(true);
  }

  if (query.panel) {
    if (['right', 'bottom'].includes(query.panel)) {
      manager.togglePanelPosition(query.panel);
    } else if (query.panel === '0') {
      manager.togglePanel(false);
    }
  }

  if (query.nav === '0') {
    manager.toggleNav(false);
  }

  if (query.selectedKind && query.selectedStory) {
    manager.selectStory(query.selectedKind, query.selectedStory);
  }

  if (!query.path || query.path === '/') {
    // TODO: strip unwanted query params and keep the one we need
    const search = stringifyQuery({ path: '/components/' });
    navigate(`/${search}`, { replace: true });
  } else {
    // TODO: strip unwanted query params and keep the one we need
    const search = stringifyQuery({ path: query.path });
    navigate(`/${search}`, { replace: true });
  }
}
