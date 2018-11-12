import { Router } from '@storybook/components';

export default function handleHistoryLoad({ location, navigate, api }) {
  const query = Router.parseQuery(location);

  if (query.full === '1') {
    api.toggleFullscreen(true);
  }

  if (query.panel) {
    if (['right', 'bottom'].includes(query.panel)) {
      api.togglePanelPosition(query.panel);
    } else if (query.panel === '0') {
      api.togglePanel(false);
    }
  }

  if (query.nav === '0') {
    api.toggleNav(false);
  }

  if (query.selectedKind && query.selectedStory) {
    api.selectStory(query.selectedKind, query.selectedStory);
  }

  // debugger;
  if (!query.path || query.path === '/') {
    // TODO: strip unwanted query params and keep the one we need
    navigate(`/components/`);
  } else {
    // TODO: strip unwanted query params and keep the one we need
    // const search = stringifyQuery({ path: query.path });
    // navigate(`/${search}`, { replace: true });
  }
}
