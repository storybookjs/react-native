import { Router } from '@storybook/components';

export default function legacyUrlSupport(state, navigate) {
  const { location } = state;
  const query = Router.parseQuery(location);

  if (query.full === '1') {
    state.ui.isFullscreen = true;
  }
  if (query.panel) {
    if (['right', 'bottom'].includes(query.panel)) {
      state.ui.panelPosition = query.panel;
    } else if (query.panel === '0') {
      state.ui.showPanel = false;
    }
  }
  if (query.nav === '0') {
    state.ui.showNav = false;
  }

  if (!query.path || query.path === '/') {
    setTimeout(() => navigate(`/components/*`, { replace: true }), 1);
  } else if (Object.keys(query).length > 1) {
    // remove other queries
    setTimeout(() => navigate(`/${query.path}`, { replace: true }), 1);
  }
}
